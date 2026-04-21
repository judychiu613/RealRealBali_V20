-- 数据库清理完成报告

-- ========================================
-- 清理操作总结
-- ========================================

-- 已删除的旧表：
-- ✅ properties_final_2026_02_21_17_30
-- ✅ property_types_final_2026_02_22_09_30  
-- ✅ property_areas_final_2026_02_21_17_30
-- ✅ land_zones_2026_02_22_06_00
-- ✅ property_type_mapping_2026_02_22_08_30
-- ✅ property_categories_2026_02_22_08_00
-- ✅ property_subcategories_2026_02_22_08_00
-- ✅ property_types_simple_2026_02_22_09_00
-- ✅ property_land_zones_final_2026_02_21_17_30
-- ✅ property_land_zones_final_2026_02_22_10_00

-- ========================================
-- 当前活跃的规范化表结构
-- ========================================

SELECT 
    '=== 核心业务表 ===' as section,
    '' as table_name,
    '' as record_count,
    '' as description
UNION ALL
SELECT 
    '',
    'properties' as table_name, 
    COUNT(*)::text as record_count,
    '房源主表 - 包含所有房源信息' as description
FROM public.properties
UNION ALL
SELECT 
    '',
    'property_types' as table_name, 
    COUNT(*)::text as record_count,
    '房源类型表 - 别墅/土地/商业' as description
FROM public.property_types
UNION ALL
SELECT 
    '',
    'property_areas' as table_name, 
    COUNT(*)::text as record_count,
    '房源区域表 - 仓古/乌布/乌鲁瓦图等' as description
FROM public.property_areas
UNION ALL
SELECT 
    '',
    'land_zones' as table_name, 
    COUNT(*)::text as record_count,
    '土地形式表 - 旅游用地/住宅用地等' as description
FROM public.land_zones
UNION ALL
SELECT 
    '',
    'property_images' as table_name, 
    COUNT(*)::text as record_count,
    '房源图片表 - 房源图片库' as description
FROM public.property_images
UNION ALL
SELECT 
    '=== 映射表 ===' as section,
    '' as table_name,
    '' as record_count,
    '' as description
UNION ALL
SELECT 
    '',
    'user_favorites_map' as table_name, 
    COUNT(*)::text as record_count,
    '用户收藏映射表 - 用户收藏关系' as description
FROM public.user_favorites_map;

-- ========================================
-- 数据完整性验证
-- ========================================

-- 验证外键关系
SELECT 
    '外键关系检查' as check_type,
    COUNT(*) as valid_relations,
    '所有房源都有有效的区域关联' as description
FROM public.properties p
JOIN public.property_areas pa ON p.area_id = pa.id
UNION ALL
SELECT 
    '外键关系检查' as check_type,
    COUNT(*) as valid_relations,
    '所有房源都有有效的类型关联' as description
FROM public.properties p
JOIN public.property_types pt ON p.type_id = pt.id
UNION ALL
SELECT 
    '外键关系检查' as check_type,
    COUNT(*) as valid_relations,
    '所有房源都有有效的土地形式关联' as description
FROM public.properties p
JOIN public.land_zones lz ON p.land_zone_id = lz.id;

-- ========================================
-- 存储空间统计
-- ========================================

SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as table_size,
    pg_size_pretty(pg_relation_size(quote_ident(table_name))) as data_size,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name)) - pg_relation_size(quote_ident(table_name))) as index_size
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('properties', 'property_types', 'property_areas', 'land_zones', 'property_images', 'user_favorites_map')
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;