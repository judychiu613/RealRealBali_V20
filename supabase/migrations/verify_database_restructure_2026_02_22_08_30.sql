-- 验证当前的表结构
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%property_type%' OR table_name LIKE '%property_categor%')
ORDER BY table_name;

-- 验证房源表的type_id现在指向新的映射表
SELECT 
    COUNT(*) as total_properties,
    COUNT(DISTINCT p.type_id) as unique_types
FROM public.properties_final_2026_02_21_17_30 p;

-- 验证映射表的数据
SELECT 
    category_en, 
    category_zh,
    COUNT(*) as subcategory_count
FROM public.property_type_mapping_2026_02_22_08_30 
GROUP BY category_en, category_zh
ORDER BY category_en;