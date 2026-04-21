-- 删除旧的带时间戳的表
-- 注意：在删除前确保新表数据完整且功能正常

-- 1. 首先验证新表数据完整性
DO $$
DECLARE
    old_count INTEGER;
    new_count INTEGER;
BEGIN
    -- 验证房源数据
    SELECT COUNT(*) INTO old_count FROM public.properties_final_2026_02_21_17_30;
    SELECT COUNT(*) INTO new_count FROM public.properties;
    
    IF old_count != new_count THEN
        RAISE EXCEPTION '房源数据迁移不完整: 旧表 % 条，新表 % 条', old_count, new_count;
    END IF;
    
    RAISE NOTICE '数据验证通过: 房源表 % 条记录', new_count;
END $$;

-- 2. 删除旧表（按依赖关系顺序）

-- 删除房源相关的旧表
DROP TABLE IF EXISTS public.properties_final_2026_02_21_17_30 CASCADE;
DROP TABLE IF EXISTS public.property_types_final_2026_02_22_09_30 CASCADE;
DROP TABLE IF EXISTS public.property_areas_final_2026_02_21_17_30 CASCADE;
DROP TABLE IF EXISTS public.land_zones_2026_02_22_06_00 CASCADE;

-- 删除其他带时间戳的表
DROP TABLE IF EXISTS public.property_type_mapping_2026_02_22_08_30 CASCADE;
DROP TABLE IF EXISTS public.property_categories_2026_02_22_08_00 CASCADE;
DROP TABLE IF EXISTS public.property_subcategories_2026_02_22_08_00 CASCADE;

-- 删除可能存在的其他临时表
DROP TABLE IF EXISTS public.property_types_simple_2026_02_22_09_00 CASCADE;
DROP TABLE IF EXISTS public.property_land_zones_final_2026_02_21_17_30 CASCADE;
DROP TABLE IF EXISTS public.property_land_zones_final_2026_02_22_10_00 CASCADE;

-- 3. 验证删除结果
SELECT 
    table_name,
    'Remaining table' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND (table_name LIKE '%_2026_%' OR table_name LIKE '%_final_%')
ORDER BY table_name;

-- 4. 显示保留的表
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size,
    'Active table' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('properties', 'property_types', 'property_areas', 'land_zones', 'property_images', 'user_favorites_map')
ORDER BY table_name;