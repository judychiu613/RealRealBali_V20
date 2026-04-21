-- 生成数据库房产数据完整报告
-- 1. 房产总数统计
SELECT 
  'Properties' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count,
  COUNT(CASE WHEN is_published = true THEN 1 END) as published_count
FROM public.properties_2026_02_21_08_00

UNION ALL

-- 2. 区域数据统计
SELECT 
  'Areas' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count,
  COUNT(*) as published_count
FROM public.property_areas_2026_02_21_08_00

UNION ALL

-- 3. 房产类型统计
SELECT 
  'Types' as table_name,
  COUNT(*) as total_records,
  0 as featured_count,
  COUNT(CASE WHEN is_active = true THEN 1 END) as published_count
FROM public.property_types_2026_02_21_08_00

UNION ALL

-- 4. 图片数据统计
SELECT 
  'Images' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as featured_count,
  COUNT(*) as published_count
FROM public.property_images_2026_02_21_08_00;

-- 5. 房产详细列表
SELECT 
  '=== PROPERTY DETAILS ===' as separator,
  '' as col2, '' as col3, '' as col4;

SELECT 
  p.slug as property_id,
  p.title_zh as title_chinese,
  p.title_en as title_english,
  CONCAT('$', FORMAT(p.price_usd, 0)) as price,
  CONCAT(p.bedrooms, 'BR/', p.bathrooms, 'BA') as rooms,
  CASE WHEN p.is_featured THEN 'YES' ELSE 'NO' END as featured,
  a.name_zh as area_chinese,
  t.name_zh as type_chinese
FROM public.properties_2026_02_21_08_00 p
LEFT JOIN public.property_areas_2026_02_21_08_00 a ON p.area_id = a.id
LEFT JOIN public.property_types_2026_02_21_08_00 t ON p.type_id = t.id
ORDER BY p.slug;

-- 6. 图片统计按房产
SELECT 
  '=== IMAGE STATISTICS ===' as separator,
  '' as col2, '' as col3;

SELECT 
  p.slug as property_id,
  p.title_zh as property_name,
  COUNT(pi.id) as total_images,
  COUNT(CASE WHEN pi.is_primary = true THEN 1 END) as primary_images
FROM public.properties_2026_02_21_08_00 p
LEFT JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id
GROUP BY p.slug, p.title_zh
ORDER BY p.slug;