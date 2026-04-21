-- 查询judy用户的收藏数量
SELECT 
    u.email,
    COUNT(ufm.id) as total_favorites,
    array_agg(ufm.property_id ORDER BY ufm.created_at DESC) as property_ids,
    MIN(ufm.created_at) as first_favorite_time,
    MAX(ufm.created_at) as last_favorite_time
FROM auth.users u
LEFT JOIN public.user_favorites_map ufm ON u.id = ufm.user_id
WHERE u.email = 'judy_chiu@outlook.com'
GROUP BY u.id, u.email;

-- 显示详细的收藏记录
SELECT 
    ufm.id,
    ufm.property_id,
    ufm.created_at,
    u.email
FROM public.user_favorites_map ufm
JOIN auth.users u ON ufm.user_id = u.id
WHERE u.email = 'judy_chiu@outlook.com'
ORDER BY ufm.created_at DESC;

-- 检查收藏表的总体状态
SELECT 
    COUNT(*) as total_favorites_all_users,
    COUNT(DISTINCT user_id) as unique_users_with_favorites,
    COUNT(DISTINCT property_id) as unique_properties_favorited
FROM public.user_favorites_map;

-- 检查RLS策略是否正常工作
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_favorites_map' 
AND schemaname = 'public';