-- 查看区域映射表的完整数据
SELECT 
  id,
  label_zh,
  label_en,
  parent_id,
  CASE 
    WHEN parent_id IS NULL THEN '一级区域'
    ELSE '二级区域'
  END as level
FROM public.property_areas_map 
ORDER BY parent_id NULLS FIRST, id;

-- 统计一级和二级区域数量
SELECT 
  CASE 
    WHEN parent_id IS NULL THEN '一级区域'
    ELSE '二级区域'
  END as level,
  COUNT(*) as count
FROM public.property_areas_map 
GROUP BY (parent_id IS NULL)
ORDER BY level;