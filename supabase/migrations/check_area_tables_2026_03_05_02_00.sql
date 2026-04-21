-- 查看所有包含area的表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%area%' OR table_name LIKE '%region%' OR table_name LIKE '%location%')
ORDER BY table_name;

-- 检查property_areas_map表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'property_areas_map';

-- 查看properties表中与区域相关的字段
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND table_schema = 'public'
  AND (column_name LIKE '%area%' OR column_name LIKE '%region%' OR column_name LIKE '%location%');