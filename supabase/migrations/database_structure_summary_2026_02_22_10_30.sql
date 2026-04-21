-- 数据库表结构总结 - 规范化命名

-- ========================================
-- 新的规范化表结构 (已创建并迁移数据)
-- ========================================

-- 1. 核心业务表
-- properties                    - 房源主表
-- property_types               - 房源类型表 (别墅/土地/商业)
-- property_areas               - 房源区域表 (仓古/乌布/乌鲁瓦图等)
-- land_zones                   - 土地形式表 (旅游用地/住宅用地等)
-- property_images              - 房源图片表

-- 2. 映射表 (使用_map后缀)
-- user_favorites_map           - 用户收藏映射表

-- ========================================
-- 旧表 (待清理)
-- ========================================

-- properties_final_2026_02_21_17_30
-- property_types_final_2026_02_22_09_30
-- property_areas_final_2026_02_21_17_30
-- land_zones_2026_02_22_06_00
-- 以及其他带时间戳的表

-- ========================================
-- 验证新表结构
-- ========================================

SELECT 
    'properties' as table_name, 
    COUNT(*) as record_count,
    'Main property data' as description
FROM public.properties
UNION ALL
SELECT 
    'property_types' as table_name, 
    COUNT(*) as record_count,
    'Villa/Land/Commercial types' as description
FROM public.property_types
UNION ALL
SELECT 
    'property_areas' as table_name, 
    COUNT(*) as record_count,
    'Canggu/Ubud/Uluwatu areas' as description
FROM public.property_areas
UNION ALL
SELECT 
    'land_zones' as table_name, 
    COUNT(*) as record_count,
    'Tourism/Residential zones' as description
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