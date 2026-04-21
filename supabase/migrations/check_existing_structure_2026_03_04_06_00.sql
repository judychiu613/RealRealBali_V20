-- 1. 检查现有的表和视图
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND (table_name LIKE '%user%' OR table_name LIKE '%admin%')
ORDER BY table_name;

-- 2. 检查现有的视图
SELECT 
    table_name as view_name
FROM information_schema.views 
WHERE table_schema = 'public' 
    AND (table_name LIKE '%user%' OR table_name LIKE '%admin%')
ORDER BY table_name;

-- 3. 检查user_profiles表是否存在及其结构
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;