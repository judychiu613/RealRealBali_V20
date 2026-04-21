-- 检查房源表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30'
AND column_name IN ('type_id', 'category_id', 'subcategory_id')
ORDER BY ordinal_position;

-- 检查现有的类型表数据
SELECT id, name_en, name_zh FROM public.property_types_final_2026_02_21_17_30 ORDER BY name_en;