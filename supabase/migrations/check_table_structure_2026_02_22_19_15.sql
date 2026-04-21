-- 查看表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'property_areas_map' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 查看所有数据
SELECT * FROM public.property_areas_map ORDER BY id LIMIT 20;