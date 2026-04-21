-- 查看当前所有房源的area_id分布
SELECT 
  area_id,
  COUNT(*) as property_count,
  type_id,
  CASE 
    WHEN area_id IN ('seminyak', 'canggu', 'ubud', 'uluwatu', 'jimbaran', 'sanur') THEN '一级区域'
    ELSE '二级区域'
  END as area_level
FROM public.properties 
GROUP BY area_id, type_id
ORDER BY area_level, area_id, type_id;

-- 检查是否还有使用一级区域的房源
SELECT 
  id,
  area_id,
  type_id
FROM public.properties 
WHERE area_id IN ('seminyak', 'canggu', 'ubud', 'uluwatu', 'jimbaran', 'sanur')
ORDER BY area_id;

-- 查看property_areas_map中可用的二级区域
SELECT id, name_zh, name_en 
FROM public.property_areas_map 
WHERE id LIKE '%-%' 
ORDER BY id;