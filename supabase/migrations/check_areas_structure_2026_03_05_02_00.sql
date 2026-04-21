-- 检查property_areas_map表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'property_areas_map' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查areas表结构和数据
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'areas' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 查看areas表的层级结构数据样例
SELECT id, name_zh, name_en, parent_id, level 
FROM areas 
ORDER BY level, parent_id, id 
LIMIT 20;