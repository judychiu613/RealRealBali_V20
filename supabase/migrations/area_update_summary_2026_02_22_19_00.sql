-- 区域更新总结报告
-- 日期: 2026-02-22 19:00
-- 目标: 将房源的area_id从一级区域更新为二级区域

-- 1. 更新前的状态检查
-- 原始房源使用的一级区域包括: seminyak, canggu, ubud, uluwatu, jimbaran, sanur

-- 2. 更新策略
-- 将一级区域的房源分配到对应的二级区域
-- 只使用property_areas_map表中确实存在的区域ID

-- 3. 更新结果验证
SELECT 
  '更新完成状态' as status,
  COUNT(*) as total_properties,
  COUNT(DISTINCT area_id) as unique_areas
FROM public.properties;

-- 4. 当前使用的二级区域分布
SELECT 
  pam.name_zh as 区域中文名,
  pam.name_en as 区域英文名,
  p.area_id as 区域ID,
  COUNT(p.id) as 房源数量,
  STRING_AGG(DISTINCT p.type_id, ', ') as 房源类型
FROM public.properties p
JOIN public.property_areas_map pam ON p.area_id = pam.id
GROUP BY pam.name_zh, pam.name_en, p.area_id
ORDER BY COUNT(p.id) DESC;

-- 5. 验证所有area_id都有效
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ 所有房源都使用有效的二级区域'
    ELSE '❌ 存在无效的区域ID'
  END as validation_result
FROM public.properties p
LEFT JOIN public.property_areas_map pam ON p.area_id = pam.id
WHERE pam.id IS NULL;

-- 6. 按房源类型统计区域分布
SELECT 
  p.type_id as 房源类型,
  COUNT(DISTINCT p.area_id) as 涉及区域数,
  COUNT(p.id) as 房源总数
FROM public.properties p
GROUP BY p.type_id
ORDER BY p.type_id;