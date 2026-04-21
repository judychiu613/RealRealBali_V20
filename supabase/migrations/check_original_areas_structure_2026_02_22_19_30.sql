-- 查看property_areas_map表的完整结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'property_areas_map' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 查看当前所有数据
SELECT * FROM public.property_areas_map ORDER BY id;

-- 检查是否有parent_id字段或类似的层级关系字段
SELECT COUNT(*) as total_areas FROM public.property_areas_map;