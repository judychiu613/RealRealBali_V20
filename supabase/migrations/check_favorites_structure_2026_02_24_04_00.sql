-- 检查收藏表的外键约束
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'user_favorites_map';

-- 检查收藏表中的现有数据
SELECT COUNT(*) as total_favorites FROM public.user_favorites_map;

-- 检查是否有properties表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'properties';

-- 如果没有properties表，检查其他可能的房源表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%propert%';

-- 检查用户表
SELECT COUNT(*) as total_users FROM auth.users;

-- 检查收藏表的所有数据（不使用JOIN避免RLS问题）
SELECT 
    id,
    user_id,
    property_id,
    created_at
FROM public.user_favorites_map 
ORDER BY created_at DESC;