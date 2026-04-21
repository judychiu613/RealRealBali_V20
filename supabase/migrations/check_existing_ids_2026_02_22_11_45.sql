-- 检查现有的土地形式和区域ID

-- 检查土地形式映射表
SELECT 'land_zones_map' as table_name, id, name_en, name_zh 
FROM public.land_zones_map 
ORDER BY id;

-- 检查区域映射表  
SELECT 'property_areas_map' as table_name, id, name_en, name_zh 
FROM public.property_areas_map 
ORDER BY id;

-- 检查现有土地类型房源
SELECT id, title_zh, area_id, land_zone_id, land_area, price_usd
FROM public.properties 
WHERE type_id = 'land'
ORDER BY id;