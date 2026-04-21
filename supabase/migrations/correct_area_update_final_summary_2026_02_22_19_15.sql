-- 正确的区域更新总结报告
-- 日期: 2026-02-22 19:15
-- 目标: 将房源的area_id从一级区域更新为二级区域，并支持前端一级和二级区域复选

-- ========== 数据库更新部分 ==========

-- 1. 区域结构说明
-- 一级区域（父级）: seminyak, canggu, ubud, uluwatu, jimbaran, sanur
-- 二级区域（子级）: seminyak-beach, echo-beach, ubud-center 等

-- 2. 房源区域更新结果验证
SELECT 
  '数据库更新状态' as category,
  COUNT(*) as total_properties,
  COUNT(DISTINCT area_id) as unique_secondary_areas,
  (SELECT COUNT(*) FROM public.properties WHERE area_id IN ('seminyak', 'canggu', 'ubud', 'uluwatu', 'jimbaran', 'sanur')) as remaining_primary_areas
FROM public.properties;

-- 3. 当前使用的二级区域分布
SELECT 
  '二级区域分布' as category,
  pam.name_zh as 区域中文名,
  pam.name_en as 区域英文名,
  p.area_id as 区域ID,
  COUNT(p.id) as 房源数量,
  STRING_AGG(DISTINCT p.type_id, ', ') as 房源类型
FROM public.properties p
JOIN public.property_areas_map pam ON p.area_id = pam.id
GROUP BY pam.name_zh, pam.name_en, p.area_id
ORDER BY COUNT(p.id) DESC;

-- ========== 前端功能更新部分 ==========

-- 4. 前端筛选器功能说明
-- ✅ 支持一级区域选择：选择"水明漾"会显示所有水明漾下的二级区域房源
-- ✅ 支持二级区域选择：选择"水明漾海滩"只显示该具体区域的房源
-- ✅ 层级显示：筛选器中一级区域下缩进显示二级区域
-- ✅ 标签显示：选中的一级和二级区域都会正确显示标签名称

-- 5. 数据完整性验证
SELECT 
  '数据完整性检查' as category,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ 所有房源都使用有效的二级区域'
    ELSE CONCAT('❌ 存在', COUNT(*), '个无效的区域ID')
  END as validation_result
FROM public.properties p
LEFT JOIN public.property_areas_map pam ON p.area_id = pam.id
WHERE pam.id IS NULL;

-- 6. 按房源类型统计区域分布
SELECT 
  '房源类型分布' as category,
  p.type_id as 房源类型,
  COUNT(DISTINCT p.area_id) as 涉及二级区域数,
  COUNT(p.id) as 房源总数
FROM public.properties p
GROUP BY p.type_id
ORDER BY p.type_id;