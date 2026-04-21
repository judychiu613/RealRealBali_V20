-- 查看区域映射表的结构和数据
SELECT 
  id,
  zh,
  en,
  parent_id,
  CASE 
    WHEN parent_id IS NULL THEN '一级区域'
    ELSE '二级区域'
  END as level
FROM public.property_areas_map 
ORDER BY parent_id NULLS FIRST, id;