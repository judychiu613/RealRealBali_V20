-- 智能区域筛选器功能总结
-- 日期: 2026-02-22 19:30
-- 功能: 实现智能的一级和二级区域筛选器

-- ========== 数据库结构恢复 ==========

-- 1. property_areas_map表结构验证
SELECT 
  '数据库结构' as category,
  COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as 一级区域数量,
  COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as 二级区域数量,
  COUNT(*) as 总区域数量
FROM public.property_areas_map;

-- 2. 一级区域列表
SELECT 
  '一级区域' as category,
  id as 区域ID,
  name_zh as 中文名,
  name_en as 英文名
FROM public.property_areas_map 
WHERE parent_id IS NULL
ORDER BY id;

-- 3. 二级区域分布
SELECT 
  '二级区域分布' as category,
  parent_id as 所属一级区域,
  COUNT(*) as 二级区域数量,
  STRING_AGG(name_zh, ', ') as 二级区域列表
FROM public.property_areas_map 
WHERE parent_id IS NOT NULL
GROUP BY parent_id
ORDER BY parent_id;

-- ========== 前端功能说明 ==========

-- 4. 智能筛选器功能特性
/*
✅ 初始状态：只显示一级区域，二级区域折叠
✅ 展开功能：点击箭头图标展开/折叠二级区域
✅ 一级区域选择：选择一级区域自动选择其下所有二级区域
✅ 二级区域选择：可以单独选择某个或某几个二级区域
✅ 智能联动：只有当一级区域下所有二级区域都被选中时，一级区域才显示为选中状态
✅ 视觉反馈：展开的区域显示旋转的箭头图标
✅ 层级显示：二级区域缩进显示，视觉层次清晰
*/

-- 5. 房源数据验证
SELECT 
  '房源数据验证' as category,
  COUNT(*) as 总房源数,
  COUNT(DISTINCT area_id) as 使用的区域数,
  STRING_AGG(DISTINCT 
    CASE 
      WHEN area_id IN (SELECT id FROM public.property_areas_map WHERE parent_id IS NULL) THEN '一级区域'
      ELSE '二级区域'
    END, ', '
  ) as 区域类型分布
FROM public.properties;

-- 6. 区域使用统计
SELECT 
  '区域使用统计' as category,
  pam.name_zh as 区域名称,
  pam.name_en as 英文名称,
  CASE 
    WHEN pam.parent_id IS NULL THEN '一级区域'
    ELSE '二级区域'
  END as 区域级别,
  COUNT(p.id) as 房源数量
FROM public.property_areas_map pam
LEFT JOIN public.properties p ON pam.id = p.area_id
GROUP BY pam.id, pam.name_zh, pam.name_en, pam.parent_id
HAVING COUNT(p.id) > 0
ORDER BY 区域级别, COUNT(p.id) DESC;