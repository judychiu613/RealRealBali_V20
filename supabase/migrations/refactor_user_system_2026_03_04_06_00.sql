-- =============================
-- 一、用户管理架构重构
-- =============================

-- 1. 删除过度复杂的表
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_operation_logs CASCADE;

-- 2. 重新创建简化的 user_profiles 表
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建索引
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_is_active ON user_profiles(is_active);

-- 4. 创建更新时间戳触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. 设置简单的RLS策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的资料
CREATE POLICY "user_profiles_own_record" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- 用户可以更新自己的资料（除了role字段）
CREATE POLICY "user_profiles_update_own" ON user_profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND 
        role = (SELECT role FROM user_profiles WHERE id = auth.uid())
    );

-- 管理员可以查看所有用户
CREATE POLICY "user_profiles_admin_read_all" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 管理员可以更新用户角色
CREATE POLICY "user_profiles_admin_update" ON user_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 6. 创建用户注册时自动创建profile的触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除旧的触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建新的触发器
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. 创建一个超级管理员账户（如果不存在）
-- 注意：这里使用一个示例邮箱，实际使用时需要替换为真实的管理员邮箱
INSERT INTO user_profiles (id, email, full_name, role)
SELECT 
    gen_random_uuid(),
    'admin@bali-property.com',
    'Super Administrator',
    'super_admin'
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE role = 'super_admin'
);

-- 8. 更新相关表的外键引用
-- 更新 user_views 表，移除对 user_roles 的依赖
ALTER TABLE user_views DROP CONSTRAINT IF EXISTS user_views_user_id_fkey;
ALTER TABLE user_views ADD CONSTRAINT user_views_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL;

-- 9. 简化 properties 表的 RLS 策略
DROP POLICY IF EXISTS "properties_public_read" ON properties;
DROP POLICY IF EXISTS "properties_authenticated_write" ON properties;

ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 公开读取所有已发布的房源
CREATE POLICY "properties_public_read" ON properties
    FOR SELECT USING (is_published = true);

-- 管理员可以管理所有房源
CREATE POLICY "properties_admin_all" ON properties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 10. 简化 property_images 表的 RLS 策略
DROP POLICY IF EXISTS "property_images_public_read" ON property_images;
DROP POLICY IF EXISTS "property_images_authenticated_write" ON property_images;

ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- 公开读取所有图片
CREATE POLICY "property_images_public_read" ON property_images
    FOR SELECT USING (true);

-- 管理员可以管理所有图片
CREATE POLICY "property_images_admin_all" ON property_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 11. 验证重构结果
SELECT 
    'user_profiles表结构' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查当前用户数量
SELECT 
    'user_profiles统计' as info,
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
    COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admins
FROM user_profiles;