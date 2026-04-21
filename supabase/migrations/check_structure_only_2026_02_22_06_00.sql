-- 检查房产表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查土地形式表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'land_zones_2026_02_22_06_00' 
AND table_schema = 'public'
ORDER BY ordinal_position;