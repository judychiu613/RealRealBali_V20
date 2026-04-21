-- 生成数据库房产数据完整报告
-- 1. 数据统计总览
SELECT 
  'Properties' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count,
  COUNT(CASE WHEN is_published = true THEN 1 END) as published_count
FROM public.properties_2026_02_21_08_00

UNION ALL

SELECT 
  'Areas' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count,
  COUNT(*) as published_count
FROM public.property_areas_2026_02_21_08_00

UNION ALL

SELECT 
  'Types' as table_name,
  COUNT(*) as total_records,
  0 as featured_count,
  COUNT(CASE WHEN is_active = true THEN 1 END) as published_count
FROM public.property_types_2026_02_21_08_00

UNION ALL

SELECT 
  'Images' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as featured_count,
  COUNT(*) as published_count
FROM public.property_images_2026_02_21_08_00;

-- 2. 房产详细列表
SELECT 
  p.slug as property_id,
  p.title_zh as title_chinese,
  p.title_en as title_english,
  CONCAT('$', p.price_usd::text) as price,
  CONCAT(p.bedrooms::text, 'BR/', p.bathrooms::text, 'BA') as rooms,
  CASE WHEN p.is_featured THEN 'YES' ELSE 'NO' END as featured,
  COALESCE(a.name_zh, 'Unknown') as area_chinese,
  COALESCE(t.name_zh, 'Unknown') as type_chinese
FROM public.properties_2026_02_21_08_00 p
LEFT JOIN public.property_areas_2026_02_21_08_00 a ON p.area_id = a.id
LEFT JOIN public.property_types_2026_02_21_08_00 t ON p.type_id = t.id
ORDER BY p.slug;

-- 3. 图片统计按房产
SELECT 
  p.slug as property_id,
  p.title_zh as property_name,
  COUNT(pi.id) as total_images,
  COUNT(CASE WHEN pi.is_primary = true THEN 1 END) as primary_images
FROM public.properties_2026_02_21_08_00 p
LEFT JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id
GROUP BY p.slug, p.title_zh
ORDER BY p.slug;