-- 检查收藏表中的数据
SELECT 
    id,
    user_id,
    property_id,
    created_at
FROM public.user_favorites_map 
ORDER BY created_at DESC 
LIMIT 10;

-- 检查用户表
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 检查收藏数据统计
SELECT 
    COUNT(*) as total_favorites,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT property_id) as unique_properties
FROM public.user_favorites_map;

-- 检查RLS策略是否正常工作
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_favorites_map';