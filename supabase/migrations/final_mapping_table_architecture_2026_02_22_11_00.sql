-- 最终映射表架构总结

-- ========================================
-- 重构后的表结构 - 正确的映射表架构
-- ========================================

-- 事实表 (Fact Tables) - 存储实际业务数据
-- properties                    - 房源事实表 (主要业务数据)
-- property_images              - 房源图片事实表

-- 映射表 (Mapping Tables) - 存储维度映射关系
-- property_types_map           - 房源类型映射表 (别墅/土地/商业)
-- property_areas_map           - 房源区域映射表 (仓古/乌布/乌鲁瓦图等)
-- land_zones_map               - 土地形式映射表 (旅游用地/住宅用地等)
-- user_favorites_map           - 用户收藏映射表 (用户收藏关系)

-- ========================================
-- 表结构验证
-- ========================================

SELECT 
    '=== 事实表 (Fact Tables) ===' as section,
    '' as table_name,
    '' as record_count,
    '' as description
UNION ALL
SELECT 
    '',
    'properties' as table_name, 
    COUNT(*)::text as record_count,
    '房源事实表 - 核心业务数据' as description
FROM public.properties
UNION ALL
SELECT 
    '',
    'property_images' as table_name, 
    COUNT(*)::text as record_count,
    '房源图片事实表 - 图片数据' as description
FROM public.property_images
UNION ALL
SELECT 
    '=== 映射表 (Mapping Tables) ===' as section,
    '' as table_name,
    '' as record_count,
    '' as description
UNION ALL
SELECT 
    '',
    'property_types_map' as table_name, 
    COUNT(*)::text as record_count,
    '房源类型映射表 - 别墅/土地/商业' as description
FROM public.property_types_map
UNION ALL
SELECT 
    '',
    'property_areas_map' as table_name, 
    COUNT(*)::text as record_count,
    '房源区域映射表 - 仓古/乌布/乌鲁瓦图等' as description
FROM public.property_areas_map
UNION ALL
SELECT 
    '',
    'land_zones_map' as table_name, 
    COUNT(*)::text as record_count,
    '土地形式映射表 - 旅游用地/住宅用地等' as description
FROM public.land_zones_map
UNION ALL
SELECT 
    '',
    'user_favorites_map' as table_name, 
    COUNT(*)::text as record_count,
    '用户收藏映射表 - 用户收藏关系' as description
FROM public.user_favorites_map;

-- ========================================
-- 外键关系验证
-- ========================================

SELECT 
    '外键关系验证' as check_type,
    tc.constraint_name,
    tc.table_name || '.' || kcu.column_name as source_column,
    ccu.table_name || '.' || ccu.column_name as target_column
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
AND tc.table_name = 'properties'
ORDER BY tc.constraint_name;

-- ========================================
-- 数据完整性检查
-- ========================================

SELECT 
    '数据完整性检查' as check_type,
    COUNT(*) as valid_count,
    '所有房源都有有效的类型映射' as description
FROM public.properties p
JOIN public.property_types_map pt ON p.type_id = pt.id
UNION ALL
SELECT 
    '数据完整性检查' as check_type,
    COUNT(*) as valid_count,
    '所有房源都有有效的区域映射' as description
FROM public.properties p
JOIN public.property_areas_map pa ON p.area_id = pa.id
UNION ALL
SELECT 
    '数据完整性检查' as check_type,
    COUNT(*) as valid_count,
    '所有房源都有有效的土地形式映射' as description
FROM public.properties p
JOIN public.land_zones_map lz ON p.land_zone_id = lz.id;