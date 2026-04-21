-- 查看现有的映射表ID

-- 查看土地形式映射表的具体ID
SELECT id, name_en, name_zh FROM public.land_zones_map ORDER BY id;

-- 查看区域映射表的具体ID  
SELECT id, name_en, name_zh FROM public.property_areas_map ORDER BY id;

-- 查看现有房源使用的ID
SELECT DISTINCT land_zone_id, area_id FROM public.properties WHERE land_zone_id IS NOT NULL;