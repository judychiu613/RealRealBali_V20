-- 删除复杂的映射表（不再需要）
DROP TABLE IF EXISTS public.property_type_mapping_2026_02_22_08_30 CASCADE;

-- 验证清理结果
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%property_type%'
ORDER BY table_name;

-- 验证房源表的type_id现在指向新的简化类型表
SELECT 
    pts.name_en,
    pts.name_zh,
    COUNT(*) as property_count
FROM public.properties_final_2026_02_21_17_30 p
JOIN public.property_types_simple_2026_02_22_09_00 pts ON p.type_id = pts.id
GROUP BY pts.name_en, pts.name_zh, pts.sort_order
ORDER BY pts.sort_order;