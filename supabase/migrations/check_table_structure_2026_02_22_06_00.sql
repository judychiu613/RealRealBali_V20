-- 检查房产表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查土地形式表数据
SELECT * FROM public.land_zones_2026_02_22_06_00 LIMIT 5;

-- 检查房产数据（前5条）
SELECT id, location_zh, location_en, land_zone_id 
FROM public.properties_final_2026_02_21_17_30 
LIMIT 5;