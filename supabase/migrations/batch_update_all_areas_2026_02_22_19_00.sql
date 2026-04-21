-- 更新所有水明漾(seminyak)的房源到二级区域
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' OR id LIKE '%9' THEN 'seminyak-beach'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'petitenget'
  WHEN id LIKE '%3' OR id LIKE '%7' THEN 'oberoi'
  ELSE 'seminyak-beach'
END
WHERE area_id = 'seminyak';

-- 更新所有仓古(canggu)的房源到二级区域
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'echo-beach'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'berawa'
  ELSE 'echo-beach'
END
WHERE area_id = 'canggu';

-- 更新所有乌布(ubud)的房源到二级区域
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'ubud-center'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'tegallalang'
  WHEN id LIKE '%3' OR id LIKE '%7' THEN 'mas'
  ELSE 'ubud-center'
END
WHERE area_id = 'ubud';

-- 更新所有乌鲁瓦图(uluwatu)的房源到二级区域
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'bingin'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'padang-padang'
  WHEN id LIKE '%3' OR id LIKE '%7' THEN 'dreamland'
  ELSE 'bingin'
END
WHERE area_id = 'uluwatu';

-- 更新所有金巴兰(jimbaran)的房源到二级区域
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'jimbaran-bay'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'kedonganan'
  ELSE 'jimbaran-bay'
END
WHERE area_id = 'jimbaran';

-- 更新所有沙努尔(sanur)的房源到二级区域
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'sanur-beach'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'sindhu'
  ELSE 'sanur-beach'
END
WHERE area_id = 'sanur';

-- 查看更新后的结果
SELECT 
  area_id,
  COUNT(*) as property_count,
  type_id
FROM public.properties 
GROUP BY area_id, type_id
ORDER BY area_id, type_id;