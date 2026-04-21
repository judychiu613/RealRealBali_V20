-- 1. 检查properties表的外键约束
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
    AND tc.table_name='properties';

-- 2. 检查相关的映射表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name LIKE '%map%'
ORDER BY table_name;

-- 3. 如果映射表存在，查看其内容
SELECT * FROM property_areas_map LIMIT 10;

-- 4. 检查当前properties表中的数据
SELECT COUNT(*) as current_count FROM properties;

-- 5. 查看properties表的列结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'properties' AND table_schema = 'public'
ORDER BY ordinal_position;