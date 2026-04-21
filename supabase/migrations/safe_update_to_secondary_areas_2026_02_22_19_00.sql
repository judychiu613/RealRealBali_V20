-- 先查看当前存在的所有区域ID
SELECT id FROM public.property_areas_map ORDER BY id;

-- 使用存在的区域ID更新房源
-- 更新水明漾(seminyak)的房源 - 使用存在的二级区域
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' OR id LIKE '%9' THEN 'seminyak-beach'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'petitenget'
  WHEN id LIKE '%3' OR id LIKE '%7' THEN 'oberoi'
  ELSE 'seminyak-beach'  -- 默认使用seminyak-beach
END
WHERE area_id = 'seminyak' 
AND EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'seminyak-beach');

-- 更新仓古(canggu)的房源
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'echo-beach'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'berawa'
  WHEN id LIKE '%3' OR id LIKE '%7' THEN 'batu-bolong'
  ELSE 'echo-beach'  -- 默认使用echo-beach
END
WHERE area_id = 'canggu' 
AND EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'echo-beach');

-- 查看更新后的结果
SELECT 
  area_id,
  COUNT(*) as property_count
FROM public.properties 
GROUP BY area_id
ORDER BY area_id;