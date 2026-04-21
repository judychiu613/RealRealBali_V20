-- 检查收藏表中的所有数据
SELECT 
    ufm.id,
    ufm.user_id,
    ufm.property_id,
    ufm.created_at,
    u.email as user_email
FROM public.user_favorites_map ufm
LEFT JOIN auth.users u ON ufm.user_id = u.id
ORDER BY ufm.created_at DESC;

-- 检查RLS策略是否阻止了查询
SET ROLE authenticated;
SELECT 
    id,
    user_id,
    property_id,
    created_at
FROM public.user_favorites_map 
ORDER BY created_at DESC 
LIMIT 5;

-- 重置角色
RESET ROLE;

-- 检查表权限
SELECT 
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'user_favorites_map';

-- 测试插入一条收藏数据（如果没有数据的话）
DO $$
DECLARE
    test_user_id uuid;
BEGIN
    -- 获取第一个用户ID
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- 插入测试收藏数据
        INSERT INTO public.user_favorites_map (user_id, property_id)
        VALUES (test_user_id, 'test-property-1')
        ON CONFLICT (user_id, property_id) DO NOTHING;
        
        RAISE NOTICE 'Test favorite inserted for user: %', test_user_id;
    ELSE
        RAISE NOTICE 'No users found in auth.users table';
    END IF;
END $$;