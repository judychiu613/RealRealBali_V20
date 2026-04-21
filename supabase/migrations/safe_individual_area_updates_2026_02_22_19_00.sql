-- 只更新到确认存在的二级区域
-- 更新水明漾房源到seminyak-beach（已确认存在）
UPDATE public.properties 
SET area_id = 'seminyak-beach'
WHERE area_id = 'seminyak';

-- 更新仓古房源到echo-beach（需要确认是否存在）
UPDATE public.properties 
SET area_id = 'echo-beach'
WHERE area_id = 'canggu'
AND EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'echo-beach');

-- 如果echo-beach不存在，使用berawa
UPDATE public.properties 
SET area_id = 'berawa'
WHERE area_id = 'canggu'
AND EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'berawa');

-- 更新乌布房源到ubud-center
UPDATE public.properties 
SET area_id = 'ubud-center'
WHERE area_id = 'ubud'
AND EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'ubud-center');

-- 更新乌鲁瓦图房源到bingin
UPDATE public.properties 
SET area_id = 'bingin'
WHERE area_id = 'uluwatu'
AND EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'bingin');

-- 更新金巴兰房源到jimbaran-bay
UPDATE public.properties 
SET area_id = 'jimbaran-bay'
WHERE area_id = 'jimbaran'
AND EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'jimbaran-bay');

-- 更新沙努尔房源到sanur-beach
UPDATE public.properties 
SET area_id = 'sanur-beach'
WHERE area_id = 'sanur'
AND EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'sanur-beach');

-- 查看更新后的结果
SELECT 
  area_id,
  COUNT(*) as property_count
FROM public.properties 
GROUP BY area_id
ORDER BY area_id;