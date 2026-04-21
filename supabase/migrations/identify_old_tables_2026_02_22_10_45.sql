-- 检查所有表并识别需要删除的旧表
SELECT 
    table_name,
    CASE 
        WHEN table_name LIKE '%_2026_%' OR table_name LIKE '%_final_%' THEN '需要删除的旧表'
        WHEN table_name IN ('properties', 'property_types', 'property_areas', 'land_zones', 'property_images', 'user_favorites_map') THEN '保留的新表'
        ELSE '其他表'
    END as table_status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_status, table_name;