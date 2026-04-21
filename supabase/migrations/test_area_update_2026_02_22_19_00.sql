-- 查看所有存在的区域ID
SELECT id, name_zh, name_en FROM public.property_areas_map ORDER BY id;

-- 只更新到确实存在的区域ID
-- 先测试更新一个房源
UPDATE public.properties 
SET area_id = 'seminyak-beach'
WHERE area_id = 'seminyak' 
AND id = (SELECT id FROM public.properties WHERE area_id = 'seminyak' LIMIT 1)
AND EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'seminyak-beach');

-- 查看更新结果
SELECT area_id, COUNT(*) FROM public.properties GROUP BY area_id ORDER BY area_id;