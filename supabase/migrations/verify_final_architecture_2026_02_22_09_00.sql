-- 验证当前的房源类型表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%property_type%'
ORDER BY table_name;

-- 验证3个房源类型的分布
SELECT 
    pts.name_en,
    pts.name_zh,
    COUNT(*) as property_count
FROM public.properties_final_2026_02_21_17_30 p
JOIN public.property_types_simple_2026_02_22_09_00 pts ON p.type_id = pts.id
GROUP BY pts.name_en, pts.name_zh, pts.sort_order
ORDER BY pts.sort_order;

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
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'properties_final_2026_02_21_17_30'
AND kcu.column_name = 'type_id';