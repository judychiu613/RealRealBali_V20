-- 检查是否存在properties表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%propert%';

-- 如果properties表存在，检查其结构
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查properties表中的数据
SELECT COUNT(*) as total_properties FROM public.properties;

-- 检查前几条数据
SELECT 
    id,
    title_zh,
    title_en,
    status
FROM public.properties 
LIMIT 5;