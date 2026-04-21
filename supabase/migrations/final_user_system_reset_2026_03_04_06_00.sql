-- =============================
-- 完全重置用户系统
-- =============================

-- 1. 删除所有复杂的表和视图
DROP VIEW IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_operation_logs CASCADE;

-- 2. 创建简化的user_profiles表
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

-- 4. 清理user_views表的数据
UPDATE user_views SET user_id = NULL WHERE user_id IS NOT NULL;

-- 5. 创建更新时间戳触发器
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

-- 6. 完全重置所有表的RLS策略
-- Properties表
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "properties_public_read" ON properties;
DROP POLICY IF EXISTS "properties_authenticated_write" ON properties;
DROP POLICY IF EXISTS "properties_admin_all" ON properties;

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "properties_read_all" ON properties FOR SELECT USING (true);

-- Property_images表
ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "property_images_public_read" ON property_images;
DROP POLICY IF EXISTS "property_images_authenticated_write" ON property_images;
DROP POLICY IF EXISTS "property_images_admin_all" ON property_images;

ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "property_images_read_all" ON property_images FOR SELECT USING (true);

-- User_views表
ALTER TABLE user_views DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_views_public_read" ON user_views;
DROP POLICY IF EXISTS "user_views_public_insert" ON user_views;

ALTER TABLE user_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_views_read_all" ON user_views FOR SELECT USING (true);
CREATE POLICY "user_views_insert_all" ON user_views FOR INSERT WITH CHECK (true);

-- User_profiles表
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_profiles_read_own" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "user_profiles_update_own" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- 7. 创建用户注册触发器
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

-- 8. 验证重构结果
SELECT 'Refactor completed successfully' as status;

-- 检查剩余的表
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('user_profiles', 'properties', 'property_images', 'user_views')
ORDER BY table_name;

-- 检查user_profiles表结构
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;