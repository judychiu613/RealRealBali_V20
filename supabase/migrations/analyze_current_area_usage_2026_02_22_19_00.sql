-- 查看当前房源使用的area_id分布
SELECT 
  area_id,
  COUNT(*) as property_count,
  type_id
FROM public.properties 
GROUP BY area_id, type_id
ORDER BY area_id, type_id;

-- 查看所有房源的详细信息
SELECT 
  id,
  area_id,
  type_id,
  CASE 
    WHEN area_id = 'seminyak' THEN '一级区域'
    WHEN area_id = 'canggu' THEN '一级区域'
    WHEN area_id = 'ubud' THEN '一级区域'
    WHEN area_id = 'uluwatu' THEN '一级区域'
    WHEN area_id = 'jimbaran' THEN '一级区域'
    WHEN area_id = 'sanur' THEN '一级区域'
    ELSE '可能是二级区域'
  END as area_level
FROM public.properties 
ORDER BY area_id, type_id;