-- 检查property_areas_final表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'property_areas_final_2026_02_21_17_30' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 查看区域数据
SELECT id, name_zh, name_en, description_zh 
FROM property_areas_final_2026_02_21_17_30 
ORDER BY id;