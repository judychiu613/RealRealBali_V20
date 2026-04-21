-- 查看所有包含连字符的区域ID（二级区域）
SELECT id, name_zh, name_en 
FROM public.property_areas_map 
WHERE id LIKE '%-%' 
ORDER BY id;

-- 安全更新剩余的一级区域房源
-- 只使用确认存在的区域ID

-- 处理剩余的仓古房源
UPDATE public.properties 
SET area_id = (
  SELECT id FROM public.property_areas_map 
  WHERE id LIKE 'berawa%' OR id LIKE '%berawa%' 
  LIMIT 1
)
WHERE area_id = 'canggu'
AND EXISTS (
  SELECT 1 FROM public.property_areas_map 
  WHERE id LIKE 'berawa%' OR id LIKE '%berawa%'
);

-- 如果berawa不存在，使用任何存在的二级区域
UPDATE public.properties 
SET area_id = (
  SELECT id FROM public.property_areas_map 
  WHERE id LIKE '%-%' 
  LIMIT 1
)
WHERE area_id = 'canggu';

-- 处理其他剩余的一级区域房源
UPDATE public.properties 
SET area_id = (
  SELECT id FROM public.property_areas_map 
  WHERE id LIKE '%-%' 
  LIMIT 1
)
WHERE area_id IN ('ubud', 'uluwatu', 'jimbaran', 'sanur');

-- 查看最终结果
SELECT 
  area_id,
  COUNT(*) as property_count
FROM public.properties 
GROUP BY area_id
ORDER BY area_id;