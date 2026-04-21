-- 新市场分区结构总结报告
-- 日期: 2026-02-22 19:45
-- 功能: 完全重构为6大市场分区的区域结构

-- ========== 新市场分区结构 ==========

-- 1. 一级分类（市场分区）验证
SELECT 
  '一级分类（市场分区）' as category,
  id as 分区ID,
  name_zh as 中文名,
  name_en as 英文名,
  (SELECT COUNT(*) FROM public.property_areas_map WHERE parent_id = pam.id) as 二级区域数量
FROM public.property_areas_map pam
WHERE parent_id IS NULL
ORDER BY id;

-- 2. West Coast – 西海岸核心区
SELECT 
  'West Coast 西海岸核心区' as category,
  id as 区域ID,
  name_zh as 中文名,
  name_en as 英文名,
  (SELECT COUNT(*) FROM public.properties WHERE area_id = pam.id) as 房源数量
FROM public.property_areas_map pam
WHERE parent_id = 'west-coast'
ORDER BY id;

-- 3. South Bukit – 南部悬崖区
SELECT 
  'South Bukit 南部悬崖区' as category,
  id as 区域ID,
  name_zh as 中文名,
  name_en as 英文名,
  (SELECT COUNT(*) FROM public.properties WHERE area_id = pam.id) as 房源数量
FROM public.property_areas_map pam
WHERE parent_id = 'south-bukit'
ORDER BY id;

-- 4. Ubud & Central Bali – 乌布及中部区域
SELECT 
  'Ubud & Central Bali 乌布及中部区域' as category,
  id as 区域ID,
  name_zh as 中文名,
  name_en as 英文名,
  (SELECT COUNT(*) FROM public.properties WHERE area_id = pam.id) as 房源数量
FROM public.property_areas_map pam
WHERE parent_id = 'ubud-central'
ORDER BY id;

-- 5. Emerging West – 西部新兴增长区
SELECT 
  'Emerging West 西部新兴增长区' as category,
  id as 区域ID,
  name_zh as 中文名,
  name_en as 英文名,
  (SELECT COUNT(*) FROM public.properties WHERE area_id = pam.id) as 房源数量
FROM public.property_areas_map pam
WHERE parent_id = 'emerging-west'
ORDER BY id;

-- 6. East Bali – 东巴厘岛
SELECT 
  'East Bali 东巴厘岛' as category,
  id as 区域ID,
  name_zh as 中文名,
  name_en as 英文名,
  (SELECT COUNT(*) FROM public.properties WHERE area_id = pam.id) as 房源数量
FROM public.property_areas_map pam
WHERE parent_id = 'east-bali'
ORDER BY id;

-- 7. North Bali – 北巴厘岛
SELECT 
  'North Bali 北巴厘岛' as category,
  id as 区域ID,
  name_zh as 中文名,
  name_en as 英文名,
  (SELECT COUNT(*) FROM public.properties WHERE area_id = pam.id) as 房源数量
FROM public.property_areas_map pam
WHERE parent_id = 'north-bali'
ORDER BY id;

-- ========== 数据完整性验证 ==========

-- 8. 房源分布统计
SELECT 
  '房源分布统计' as category,
  parent.name_zh as 市场分区,
  COUNT(p.id) as 房源总数,
  COUNT(DISTINCT p.area_id) as 涉及二级区域数
FROM public.properties p
JOIN public.property_areas_map child ON p.area_id = child.id
JOIN public.property_areas_map parent ON child.parent_id = parent.id
GROUP BY parent.id, parent.name_zh
ORDER BY COUNT(p.id) DESC;

-- 9. 数据完整性检查
SELECT 
  '数据完整性检查' as category,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ 所有房源都使用有效的区域ID'
    ELSE CONCAT('❌ 存在', COUNT(*), '个无效的区域ID')
  END as validation_result
FROM public.properties p
LEFT JOIN public.property_areas_map pam ON p.area_id = pam.id
WHERE pam.id IS NULL;

-- 10. 区域结构总览
SELECT 
  '区域结构总览' as category,
  COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as 一级分类数量,
  COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as 二级区域数量,
  COUNT(*) as 总区域数量
FROM public.property_areas_map;