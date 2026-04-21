-- 验证房源类型表
SELECT * FROM public.property_types_final_2026_02_22_09_30 ORDER BY sort_order;

-- 验证房源表的type_id字段
SELECT 
    p.type_id,
    pt.name_en,
    pt.name_zh,
    COUNT(*) as property_count
FROM public.properties_final_2026_02_21_17_30 p
JOIN public.property_types_final_2026_02_22_09_30 pt ON p.type_id = pt.id
GROUP BY p.type_id, pt.name_en, pt.name_zh, pt.sort_order
ORDER BY pt.sort_order;

-- 验证外键约束
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'properties_final_2026_02_21_17_30'
AND kcu.column_name = 'type_id';