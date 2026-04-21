-- 检查现有土地形式表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%zone%'
ORDER BY table_name;

-- 检查现有土地形式数据
SELECT * FROM public.land_zones_2026_02_22_06_00 ORDER BY id;