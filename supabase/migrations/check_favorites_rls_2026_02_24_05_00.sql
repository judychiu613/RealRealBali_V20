-- 检查收藏表数据
SELECT 
    COUNT(*) as total_favorites,
    COUNT(DISTINCT user_id) as unique_users,
    array_agg(DISTINCT property_id) as property_ids
FROM public.user_favorites_map;

-- 检查judy用户的收藏
SELECT 
    ufm.id,
    ufm.user_id,
    ufm.property_id,
    ufm.created_at,
    u.email
FROM public.user_favorites_map ufm
JOIN auth.users u ON ufm.user_id = u.id
WHERE u.email = 'judy_chiu@outlook.com'
ORDER BY ufm.created_at DESC;

-- 检查RLS策略
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_favorites_map';

-- 测试RLS策略是否工作
SET LOCAL ROLE authenticated;
SELECT COUNT(*) as accessible_favorites FROM public.user_favorites_map;