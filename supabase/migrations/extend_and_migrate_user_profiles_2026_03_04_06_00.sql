-- =============================
-- 扩展user_profiles表并迁移数据
-- =============================

-- 1. 为user_profiles表添加缺失的字段
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'zh' CHECK (preferred_language IN ('zh', 'en')),
ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'CNY' CHECK (preferred_currency IN ('USD', 'CNY', 'IDR')),
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- 2. 更新phone字段名称（如果需要的话）
-- 检查是否有phone字段，如果有且没有phone_number字段，则重命名
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'phone' AND table_schema = 'public') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'phone_number' AND table_schema = 'public') THEN
        ALTER TABLE user_profiles RENAME COLUMN phone TO phone_number;
        RAISE NOTICE 'Renamed phone column to phone_number';
    END IF;
END $$;

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferred_language ON user_profiles(preferred_language);
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferred_currency ON user_profiles(preferred_currency);
CREATE INDEX IF NOT EXISTS idx_user_profiles_country_code ON user_profiles(country_code);

-- 4. 从原表迁移数据（如果原表存在）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles_2026_02_21_06_55' AND table_schema = 'public') THEN
        -- 迁移数据，所有用户角色设为'user'
        INSERT INTO user_profiles (
            id, 
            email, 
            full_name, 
            avatar_url,
            preferred_language, 
            preferred_currency, 
            country_code, 
            phone_number,
            role,
            is_active,
            created_at
        )
        SELECT 
            id,
            email,
            full_name,
            avatar_url,
            COALESCE(preferred_language, 'zh') as preferred_language,
            COALESCE(preferred_currency, 'CNY') as preferred_currency,
            country_code,
            phone_number,
            'user' as role,  -- 所有迁移的用户都设为普通用户
            true as is_active,
            COALESCE(created_at, NOW()) as created_at
        FROM user_profiles_2026_02_21_06_55
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            avatar_url = EXCLUDED.avatar_url,
            preferred_language = EXCLUDED.preferred_language,
            preferred_currency = EXCLUDED.preferred_currency,
            country_code = EXCLUDED.country_code,
            phone_number = EXCLUDED.phone_number,
            updated_at = NOW();
            
        RAISE NOTICE 'Data migrated from user_profiles_2026_02_21_06_55';
    ELSE
        RAISE NOTICE 'Original table user_profiles_2026_02_21_06_55 not found, skipping migration';
    END IF;
END $$;

-- 5. 更新用户注册触发器，包含新字段
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_country TEXT;
    user_language TEXT;
    user_currency TEXT;
BEGIN
    -- 从用户的元数据中提取国家代码和语言偏好
    user_country := COALESCE(NEW.raw_user_meta_data->>'country_code', 'ID'); -- 默认印尼
    
    -- 根据国家代码设置默认语言和货币
    CASE user_country
        WHEN 'CN' THEN 
            user_language := 'zh';
            user_currency := 'CNY';
        WHEN 'US', 'AU', 'GB', 'CA' THEN
            user_language := 'en';
            user_currency := 'USD';
        WHEN 'ID' THEN
            user_language := 'en'; -- 印尼用户默认英文
            user_currency := 'IDR';
        ELSE
            user_language := 'en';
            user_currency := 'USD';
    END CASE;
    
    -- 如果用户元数据中有明确的语言偏好，使用用户的偏好
    user_language := COALESCE(NEW.raw_user_meta_data->>'preferred_language', user_language);
    user_currency := COALESCE(NEW.raw_user_meta_data->>'preferred_currency', user_currency);

    INSERT INTO public.user_profiles (
        id, 
        email, 
        full_name, 
        avatar_url,
        preferred_language,
        preferred_currency,
        country_code,
        phone_number,
        role,
        is_active
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url',
        user_language,
        user_currency,
        user_country,
        NEW.raw_user_meta_data->>'phone_number',
        'user', -- 新注册用户默认为普通用户
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        preferred_language = EXCLUDED.preferred_language,
        preferred_currency = EXCLUDED.preferred_currency,
        country_code = EXCLUDED.country_code,
        phone_number = EXCLUDED.phone_number,
        updated_at = NOW();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 创建一个函数来获取用户的语言和货币偏好
CREATE OR REPLACE FUNCTION get_user_preferences(user_id UUID)
RETURNS TABLE(
    preferred_language TEXT,
    preferred_currency TEXT,
    country_code TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.preferred_language,
        up.preferred_currency,
        up.country_code
    FROM user_profiles up
    WHERE up.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. 验证扩展结果
SELECT 
    'Extended user_profiles structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. 检查迁移后的数据统计
SELECT 
    'Migration statistics' as info,
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
    COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admins,
    COUNT(CASE WHEN preferred_language = 'zh' THEN 1 END) as chinese_users,
    COUNT(CASE WHEN preferred_language = 'en' THEN 1 END) as english_users,
    COUNT(CASE WHEN preferred_currency = 'CNY' THEN 1 END) as cny_users,
    COUNT(CASE WHEN preferred_currency = 'USD' THEN 1 END) as usd_users,
    COUNT(CASE WHEN preferred_currency = 'IDR' THEN 1 END) as idr_users
FROM user_profiles;

-- 9. 显示迁移后的样本数据
SELECT 
    'Sample migrated data' as info,
    id,
    email,
    full_name,
    preferred_language,
    preferred_currency,
    country_code,
    phone_number,
    role,
    is_active,
    created_at
FROM user_profiles 
ORDER BY created_at DESC
LIMIT 5;