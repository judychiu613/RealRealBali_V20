-- 检查完整数据库状态和统计
-- 1. 总体统计
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
  0 as featured_count,
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

-- 2. 价格范围统计
SELECT 
  'Price Statistics' as category,
  MIN(price_usd) as min_price,
  MAX(price_usd) as max_price,
  ROUND(AVG(price_usd)) as avg_price
FROM public.properties_2026_02_21_08_00;

-- 3. 按区域统计房产数量
SELECT 
  a.name_zh as area_name,
  COUNT(p.id) as property_count,
  COUNT(CASE WHEN p.is_featured = true THEN 1 END) as featured_count
FROM public.property_areas_2026_02_21_08_00 a
LEFT JOIN public.properties_2026_02_21_08_00 p ON a.id = p.area_id
GROUP BY a.name_zh, a.sort_order
ORDER BY a.sort_order;

-- 4. 按房产类型统计
SELECT 
  t.name_zh as type_name,
  COUNT(p.id) as property_count,
  ROUND(AVG(p.price_usd)) as avg_price
FROM public.property_types_2026_02_21_08_00 t
LEFT JOIN public.properties_2026_02_21_08_00 p ON t.id = p.type_id
GROUP BY t.name_zh, t.sort_order
ORDER BY property_count DESC;

-- 5. 验证图片数据完整性
SELECT 
  'Image Completeness Check' as check_type,
  COUNT(DISTINCT p.id) as total_properties,
  COUNT(DISTINCT pi.property_id) as properties_with_images,
  COUNT(pi.id) as total_images,
  COUNT(CASE WHEN pi.is_primary = true THEN 1 END) as primary_images
FROM public.properties_2026_02_21_08_00 p
LEFT JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id;