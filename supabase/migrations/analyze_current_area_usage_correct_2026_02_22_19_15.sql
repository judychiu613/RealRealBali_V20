-- 查看当前房源使用的area_id
SELECT 
  area_id,
  COUNT(*) as property_count,
  type_id
FROM public.properties 
GROUP BY area_id, type_id
ORDER BY area_id, type_id;

-- 查看property_areas_map中的所有区域
SELECT id, name_zh, name_en FROM public.property_areas_map ORDER BY id;

-- 检查哪些是一级区域（根据前端定义）
SELECT 
  area_id,
  COUNT(*) as count,
  CASE 
    WHEN area_id IN ('seminyak', 'canggu', 'ubud', 'uluwatu', 'jimbaran', 'sanur') THEN '一级区域'
    ELSE '可能是二级区域'
  END as level
FROM public.properties 
GROUP BY area_id
ORDER BY level, area_id;