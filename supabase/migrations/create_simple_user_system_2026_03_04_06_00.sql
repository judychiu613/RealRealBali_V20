-- =============================
-- 创建简化的用户系统
-- =============================

-- 1. 删除复杂的表和视图
DROP VIEW IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_operation_logs CASCADE;

-- 2. 创建简化的user_profiles表
CREATE TABLE IF NOT EXISTS user_profiles (
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
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

-- 4. 现在清理user_views表的数据
-- 将所有user_views的user_id设为NULL（匿名浏览）
UPDATE user_views SET user_id = NULL WHERE user_id IS NOT NULL;

-- 5. 创建更新时间戳触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 设置简单的RLS策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的资料
CREATE POLICY "user_profiles_select_own" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- 用户可以更新自己的资料
CREATE POLICY "user_profiles_update_own" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 7. 简化其他表的RLS策略
-- Properties表：完全公开读取
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "properties_public_read" ON properties FOR SELECT USING (true);

-- Property_images表：完全公开读取
ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "property_images_public_read" ON property_images FOR SELECT USING (true);

-- User_views表：完全公开
ALTER TABLE user_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_views_public_read" ON user_views FOR SELECT USING (true);
CREATE POLICY "user_views_public_insert" ON user_views FOR INSERT WITH CHECK (true);

-- 8. 创建用户注册触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. 插入一个测试管理员用户（如果需要的话）
-- 注意：这只是创建profile记录，实际的auth.users记录需要通过注册创建
INSERT INTO user_profiles (id, email, full_name, role)
VALUES (
    gen_random_uuid(),
    'admin@example.com',
    'Test Administrator',
    'super_admin'
) ON CONFLICT (id) DO NOTHING;

-- 10. 验证结果
SELECT 
    'Current tables' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND (table_name LIKE '%user%' OR table_name LIKE '%admin%')
ORDER BY table_name;

-- 检查user_profiles表结构
SELECT 
    'user_profiles columns' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查当前数据
SELECT 
    'user_profiles data' as info,
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
    COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admins
FROM user_profiles;