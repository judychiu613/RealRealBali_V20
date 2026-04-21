-- =============================
-- 用户管理架构重构（基于实际结构）
-- =============================

-- 1. 删除视图和表（使用正确的命令）
DROP VIEW IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_operation_logs CASCADE;

-- 2. 检查user_profiles表是否存在，如果不存在则创建
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
        
        -- 创建索引
        CREATE INDEX idx_user_profiles_role ON user_profiles(role);
        CREATE INDEX idx_user_profiles_email ON user_profiles(email);
        CREATE INDEX idx_user_profiles_is_active ON user_profiles(is_active);
        
        RAISE NOTICE 'Created user_profiles table';
    ELSE
        -- 如果表存在，检查是否有role列，如果没有则添加
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'role' AND table_schema = 'public') THEN
            ALTER TABLE user_profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));
            CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
            RAISE NOTICE 'Added role column to existing user_profiles table';
        END IF;
        
        -- 检查是否有is_active列
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'is_active' AND table_schema = 'public') THEN
            ALTER TABLE user_profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
            CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);
            RAISE NOTICE 'Added is_active column to existing user_profiles table';
        END IF;
        
        RAISE NOTICE 'Updated existing user_profiles table';
    END IF;
END $$;

-- 3. 创建或更新时间戳触发器
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

-- 4. 重新设置RLS策略
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 删除所有旧策略
DROP POLICY IF EXISTS "user_profiles_own_record" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_read_all" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_admin_update" ON user_profiles;

-- 启用RLS并创建新策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的资料
CREATE POLICY "user_profiles_own_record" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- 用户可以更新自己的资料（除了role字段）
CREATE POLICY "user_profiles_update_own" ON user_profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND 
        (role = (SELECT role FROM user_profiles WHERE id = auth.uid()) OR role IS NULL)
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

-- 5. 创建用户注册时自动创建profile的触发器
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

-- 删除旧的触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建新的触发器
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. 简化properties表的RLS策略
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;

-- 删除所有旧策略
DROP POLICY IF EXISTS "properties_public_read" ON properties;
DROP POLICY IF EXISTS "properties_authenticated_write" ON properties;
DROP POLICY IF EXISTS "properties_admin_all" ON properties;

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 公开读取所有房源（不再限制is_published）
CREATE POLICY "properties_public_read" ON properties
    FOR SELECT USING (true);

-- 管理员可以管理所有房源
CREATE POLICY "properties_admin_all" ON properties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 7. 简化property_images表的RLS策略
ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "property_images_public_read" ON property_images;
DROP POLICY IF EXISTS "property_images_authenticated_write" ON property_images;
DROP POLICY IF EXISTS "property_images_admin_all" ON property_images;

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

-- 8. 更新user_views表的外键（如果存在）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_views' AND table_schema = 'public') THEN
        -- 删除旧的外键约束
        ALTER TABLE user_views DROP CONSTRAINT IF EXISTS user_views_user_id_fkey;
        
        -- 添加新的外键约束（允许NULL，因为可能有匿名用户的浏览记录）
        ALTER TABLE user_views ADD CONSTRAINT user_views_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE SET NULL;
            
        RAISE NOTICE 'Updated user_views foreign key constraint';
    END IF;
END $$;

-- 9. 验证重构结果
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

-- 检查当前策略
SELECT 
    'RLS策略' as info,
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('user_profiles', 'properties', 'property_images')
ORDER BY tablename, policyname;