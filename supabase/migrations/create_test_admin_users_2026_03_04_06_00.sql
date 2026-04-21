-- 创建测试管理员用户
-- 注意：这只是创建user_profiles记录，实际的auth.users记录需要通过注册创建

-- 1. 检查当前用户数据
SELECT 
    'Current user profiles' as info,
    id,
    email,
    full_name,
    role,
    is_active
FROM user_profiles
ORDER BY created_at DESC;

-- 2. 创建一个测试超级管理员记录（使用随机UUID）
INSERT INTO user_profiles (
    id, 
    email, 
    full_name, 
    role, 
    is_active,
    preferred_language,
    preferred_currency
) VALUES (
    gen_random_uuid(),
    'admin@test.com',
    'Test Super Admin',
    'super_admin',
    true,
    'zh',
    'CNY'
) ON CONFLICT (id) DO NOTHING;

-- 3. 创建一个测试房源管理员记录
INSERT INTO user_profiles (
    id, 
    email, 
    full_name, 
    role, 
    is_active,
    preferred_language,
    preferred_currency
) VALUES (
    gen_random_uuid(),
    'property-admin@test.com',
    'Test Property Admin',
    'admin',
    true,
    'zh',
    'CNY'
) ON CONFLICT (id) DO NOTHING;

-- 4. 检查插入结果
SELECT 
    'Test admin users created' as info,
    id,
    email,
    full_name,
    role,
    is_active
FROM user_profiles
WHERE role IN ('super_admin', 'admin')
ORDER BY created_at DESC;