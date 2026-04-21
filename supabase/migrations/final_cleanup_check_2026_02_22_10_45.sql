-- 最终清理检查

-- 1. 检查是否还有遗留的带时间戳的表
SELECT 
    table_name,
    table_type,
    'Needs cleanup' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%_2026_%' OR table_name LIKE '%_final_%')
ORDER BY table_name;

-- 2. 检查是否有遗留的外键约束引用已删除的表
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
AND tc.table_schema = 'public'
AND (ccu.table_name LIKE '%_2026_%' OR ccu.table_name LIKE '%_final_%');

-- 3. 显示当前活跃的表结构
SELECT 
    t.table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(t.table_name))) as table_size,
    (SELECT COUNT(*) 
     FROM information_schema.columns c 
     WHERE c.table_name = t.table_name 
     AND c.table_schema = 'public') as column_count,
    CASE 
        WHEN t.table_name LIKE '%_map' THEN 'Mapping Table'
        WHEN t.table_name IN ('properties', 'property_types', 'property_areas', 'land_zones', 'property_images') THEN 'Core Business Table'
        ELSE 'Other Table'
    END as table_category
FROM information_schema.tables t
WHERE t.table_schema = 'public' 
AND t.table_type = 'BASE TABLE'
ORDER BY table_category, t.table_name;

-- 4. 验证核心表的记录数量
SELECT 
    'properties' as table_name, 
    COUNT(*) as record_count,
    'Main property listings' as description
FROM public.properties
UNION ALL
SELECT 
    'property_types' as table_name, 
    COUNT(*) as record_count,
    'Property type categories' as description
FROM public.property_types
UNION ALL
SELECT 
    'property_areas' as table_name, 
    COUNT(*) as record_count,
    'Geographic areas' as description
FROM public.property_areas
UNION ALL
SELECT 
    'land_zones' as table_name, 
    COUNT(*) as record_count,
    'Land zoning types' as description
FROM public.land_zones
UNION ALL
SELECT 
    'property_images' as table_name, 
    COUNT(*) as record_count,
    'Property image gallery' as description
FROM public.property_images
UNION ALL
SELECT 
    'user_favorites_map' as table_name, 
    COUNT(*) as record_count,
    'User favorite mappings' as description
FROM public.user_favorites_map
ORDER BY table_name;