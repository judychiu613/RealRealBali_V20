-- 检查房源表的type_id字段类型和现有数据
SELECT DISTINCT p.type_id, pt.name_en, pt.name_zh, COUNT(*) as property_count
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_types_final_2026_02_21_17_30 pt ON p.type_id = pt.id
GROUP BY p.type_id, pt.name_en, pt.name_zh
ORDER BY property_count DESC;

-- 检查房源表结构中type_id的数据类型
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30' 
AND column_name = 'type_id';