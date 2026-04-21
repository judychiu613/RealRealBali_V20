-- 验证更新结果
-- 1. 检查是否还有使用一级区域的房源
SELECT 
  COUNT(*) as remaining_primary_areas
FROM public.properties 
WHERE area_id IN ('seminyak', 'canggu', 'ubud', 'uluwatu', 'jimbaran', 'sanur');

-- 2. 查看当前所有房源的area_id分布
SELECT 
  area_id,
  COUNT(*) as property_count,
  type_id
FROM public.properties 
GROUP BY area_id, type_id
ORDER BY area_id, type_id;

-- 3. 验证所有area_id都存在于property_areas_map中
SELECT 
  p.area_id,
  COUNT(*) as property_count,
  CASE 
    WHEN pam.id IS NOT NULL THEN '✅ 存在'
    ELSE '❌ 不存在'
  END as area_exists_in_map
FROM public.properties p
LEFT JOIN public.property_areas_map pam ON p.area_id = pam.id
GROUP BY p.area_id, pam.id
ORDER BY p.area_id;

-- 4. 显示使用的二级区域及其中英文名称
SELECT DISTINCT
  p.area_id,
  pam.name_zh,
  pam.name_en,
  COUNT(p.id) as property_count
FROM public.properties p
JOIN public.property_areas_map pam ON p.area_id = pam.id
GROUP BY p.area_id, pam.name_zh, pam.name_en
ORDER BY COUNT(p.id) DESC;