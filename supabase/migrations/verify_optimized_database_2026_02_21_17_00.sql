-- 验证优化后的数据库结构和数据完整性

-- 1. 验证房产主表的ID格式
SELECT 
  'Property IDs Format Check' as check_type,
  COUNT(*) as total_properties,
  COUNT(CASE WHEN id LIKE 'prop-%' THEN 1 END) as proper_format_count,
  MIN(id) as first_id,
  MAX(id) as last_id
FROM public.properties_optimized_2026_02_21_17_00;

-- 2. 验证图片关联
SELECT 
  'Image Relations Check' as check_type,
  COUNT(DISTINCT p.id) as properties_with_images,
  COUNT(pi.id) as total_images,
  ROUND(COUNT(pi.id)::numeric / COUNT(DISTINCT p.id), 2) as avg_images_per_property,
  COUNT(CASE WHEN pi.is_primary = true THEN 1 END) as primary_images
FROM public.properties_optimized_2026_02_21_17_00 p
JOIN public.property_images_optimized_2026_02_21_17_00 pi ON p.id = pi.property_id;

-- 3. 验证精选房产
SELECT 
  'Featured Properties Check' as check_type,
  COUNT(*) as total_properties,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count,
  COUNT(CASE WHEN is_published = true THEN 1 END) as published_count
FROM public.properties_optimized_2026_02_21_17_00;

-- 4. 查看前10个房产的详细信息
SELECT 
  id,
  title_zh,
  price_usd,
  bedrooms,
  bathrooms,
  is_featured,
  is_published,
  (SELECT COUNT(*) FROM public.property_images_optimized_2026_02_21_17_00 WHERE property_id = p.id) as image_count
FROM public.properties_optimized_2026_02_21_17_00 p
ORDER BY id
LIMIT 10;

-- 5. 验证外键关系
SELECT 
  'Foreign Key Relations' as check_type,
  COUNT(DISTINCT p.area_id) as unique_areas,
  COUNT(DISTINCT p.type_id) as unique_types,
  COUNT(CASE WHEN a.id IS NULL THEN 1 END) as missing_area_refs,
  COUNT(CASE WHEN t.id IS NULL THEN 1 END) as missing_type_refs
FROM public.properties_optimized_2026_02_21_17_00 p
LEFT JOIN public.property_areas_optimized_2026_02_21_17_00 a ON p.area_id = a.id
LEFT JOIN public.property_types_optimized_2026_02_21_17_00 t ON p.type_id = t.id;