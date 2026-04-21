-- 1. 检查auth.users表中的用户
SELECT 
    'Auth users' as info,
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 2. 检查user_profiles表中的用户
SELECT 
    'User profiles' as info,
    id,
    email,
    full_name,
    role,
    is_active
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;

-- 3. 如果有用户，将第一个用户设为超级管理员
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- 获取第一个用户的ID
    SELECT id INTO first_user_id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        -- 如果user_profiles中没有这个用户，创建记录
        INSERT INTO user_profiles (
            id, 
            email, 
            full_name, 
            role, 
            is_active,
            preferred_language,
            preferred_currency
        ) 
        SELECT 
            first_user_id,
            email,
            COALESCE(raw_user_meta_data->>'full_name', email),
            'super_admin',
            true,
            'zh',
            'CNY'
        FROM auth.users 
        WHERE id = first_user_id
        ON CONFLICT (id) DO UPDATE SET
            role = 'super_admin',
            is_active = true;
            
        RAISE NOTICE 'Set user % as super admin', first_user_id;
    ELSE
        RAISE NOTICE 'No users found in auth.users table';
    END IF;
END $$;

-- 4. 验证结果
SELECT 
    'Admin users after update' as info,
    up.id,
    up.email,
    up.full_name,
    up.role,
    up.is_active,
    au.email as auth_email
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE up.role IN ('super_admin', 'admin')
ORDER BY up.created_at DESC;