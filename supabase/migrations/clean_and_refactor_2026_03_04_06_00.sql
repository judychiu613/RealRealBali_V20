-- =============================
-- 清理数据并重构用户系统
-- =============================

-- 1. 删除视图和表
DROP VIEW IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_operation_logs CASCADE;

-- 2. 先处理user_views表的数据清理
-- 删除user_views中不存在对应user_profiles记录的数据
DELETE FROM user_views 
WHERE user_id IS NOT NULL 
    AND user_id NOT IN (
        SELECT id FROM user_profiles WHERE id IS NOT NULL
    );

-- 或者更简单的方法：将所有user_views的user_id设为NULL（匿名浏览）
UPDATE user_views SET user_id = NULL;

-- 3. 确保user_profiles表存在并有正确的结构
DO $$
BEGIN
    -- 如果user_profiles表不存在，创建它
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
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
        
        RAISE NOTICE 'Created user_profiles table';
    ELSE
        -- 如果表存在，确保有role列
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'role' AND table_schema = 'public') THEN
            ALTER TABLE user_profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));
            RAISE NOTICE 'Added role column';
        END IF;
        
        -- 确保有is_active列
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'is_active' AND table_schema = 'public') THEN
            ALTER TABLE user_profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
            RAISE NOTICE 'Added is_active column';
        END IF;
    END IF;
END $$;

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

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

-- 6. 重新设置RLS策略
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 删除所有旧策略
DROP POLICY IF EXISTS "user_profiles_own_record" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_read_all" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_update" ON user_profiles;

-- 启用RLS并创建简单策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的资料
CREATE POLICY "user_profiles_select_own" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- 用户可以更新自己的资料
CREATE POLICY "user_profiles_update_own" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 7. 简化properties和property_images的RLS策略
-- Properties表：完全公开读取
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "properties_public_read" ON properties;
DROP POLICY IF EXISTS "properties_authenticated_write" ON properties;
DROP POLICY IF EXISTS "properties_admin_all" ON properties;

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "properties_public_read" ON properties FOR SELECT USING (true);

-- Property_images表：完全公开读取
ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "property_images_public_read" ON property_images;
DROP POLICY IF EXISTS "property_images_authenticated_write" ON property_images;
DROP POLICY IF EXISTS "property_images_admin_all" ON property_images;

ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "property_images_public_read" ON property_images FOR SELECT USING (true);

-- User_views表：完全公开
ALTER TABLE user_views DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_views_public_read" ON user_views;
DROP POLICY IF EXISTS "user_views_public_insert" ON user_views;

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

-- 9. 验证重构结果
SELECT 
    'Tables after refactor' as info,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND (table_name LIKE '%user%' OR table_name LIKE '%admin%')
ORDER BY table_name;

-- 检查user_profiles表结构
SELECT 
    'user_profiles structure' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;