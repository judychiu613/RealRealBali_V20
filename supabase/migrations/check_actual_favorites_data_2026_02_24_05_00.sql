-- 查询judy用户的实际收藏数据（只查询，不修改）
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

-- 检查表结构
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_favorites_map' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查是否有其他可能的收藏表名
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%favorite%'
OR table_name LIKE '%fav%';