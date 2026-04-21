-- 查看property_areas_map表中所有的区域ID
SELECT id, name_zh, name_en FROM public.property_areas_map ORDER BY id;

-- 查看是否有层级结构的字段
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'property_areas_map' 
AND table_schema = 'public';