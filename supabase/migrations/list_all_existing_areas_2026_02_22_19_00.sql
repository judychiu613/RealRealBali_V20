-- 查看所有存在的区域ID
SELECT id, name_zh, name_en FROM public.property_areas_map 
WHERE id LIKE '%--%' OR id LIKE '%-%' 
ORDER BY id;

-- 查看所有区域ID（包括一级和二级）
SELECT id, name_zh, name_en FROM public.property_areas_map 
ORDER BY id;