-- 检查数据库连接和数据完整性

-- 1. 检查房产数据是否存在
SELECT 
  'Property Data Check' as check_type,
  COUNT(*) as total_properties,
  COUNT(CASE WHEN is_published = true THEN 1 END) as published_properties,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_properties
FROM public.properties_final_2026_02_21_17_30;

-- 2. 检查图片数据
SELECT 
  'Image Data Check' as check_type,
  COUNT(*) as total_images,
  COUNT(DISTINCT property_id) as properties_with_images
FROM public.property_images_final_2026_02_21_17_30;

-- 3. 检查区域数据
SELECT 
  'Area Data Check' as check_type,
  COUNT(*) as total_areas,
  COUNT(CASE WHEN level = 1 THEN 1 END) as level_1_areas,
  COUNT(CASE WHEN level = 2 THEN 1 END) as level_2_areas
FROM public.property_areas_final_2026_02_21_17_30;

-- 4. 检查房产类型数据
SELECT 
  'Property Types Check' as check_type,
  COUNT(*) as total_types,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_types
FROM public.property_types_final_2026_02_21_17_30;

-- 5. 检查外键关系
SELECT 
  'Foreign Key Check' as check_type,
  p.id,
  p.title_zh,
  CASE WHEN a.id IS NOT NULL THEN 'OK' ELSE 'MISSING AREA' END as area_status,
  CASE WHEN pt.id IS NOT NULL THEN 'OK' ELSE 'MISSING TYPE' END as type_status
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_areas_final_2026_02_21_17_30 a ON p.area_id = a.id
LEFT JOIN public.property_types_final_2026_02_21_17_30 pt ON p.type_id = pt.id
ORDER BY p.id
LIMIT 5;