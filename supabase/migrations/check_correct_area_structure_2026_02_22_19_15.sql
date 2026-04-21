-- 查看property_areas_map表的完整结构
SELECT 
  id,
  name_zh,
  name_en,
  parent_id,
  CASE 
    WHEN parent_id IS NULL THEN '一级区域'
    ELSE '二级区域'
  END as level
FROM public.property_areas_map 
ORDER BY parent_id NULLS FIRST, id;

-- 查看一级区域（parent_id为NULL）
SELECT 
  id,
  name_zh,
  name_en
FROM public.property_areas_map 
WHERE parent_id IS NULL
ORDER BY id;

-- 查看二级区域（有parent_id）
SELECT 
  id,
  name_zh,
  name_en,
  parent_id
FROM public.property_areas_map 
WHERE parent_id IS NOT NULL
ORDER BY parent_id, id;