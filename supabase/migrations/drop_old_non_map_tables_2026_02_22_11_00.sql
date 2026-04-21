-- 删除旧的非映射表

-- 删除旧表
DROP TABLE IF EXISTS public.land_zones CASCADE;
DROP TABLE IF EXISTS public.property_areas CASCADE;
DROP TABLE IF EXISTS public.property_types CASCADE;

-- 验证删除结果
SELECT 
    table_name,
    CASE 
        WHEN table_name LIKE '%_map' THEN 'Mapping Table ✓'
        WHEN table_name IN ('properties', 'property_images') THEN 'Fact Table ✓'
        ELSE 'Other Table'
    END as table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_type, table_name;