-- 测试数据库查询以验证Edge Function数据源

-- 1. 模拟Edge Function的精选房产查询
SELECT 
  p.id,
  p.title_zh,
  p.title_en,
  p.price_usd,
  p.price_cny,
  p.price_idr,
  p.bedrooms,
  p.bathrooms,
  p.building_area,
  p.land_area,
  p.is_featured,
  p.is_published,
  a.name_zh as area_name_zh,
  a.name_en as area_name_en,
  pt.name_zh as type_name_zh,
  pt.name_en as type_name_en,
  pt.slug as type_slug
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_areas_final_2026_02_21_17_30 a ON p.area_id = a.id
LEFT JOIN public.property_types_final_2026_02_21_17_30 pt ON p.type_id = pt.id
WHERE p.is_featured = true AND p.is_published = true
ORDER BY p.created_at DESC
LIMIT 10;

-- 2. 检查图片数据
SELECT 
  pi.property_id,
  pi.image_url,
  pi.is_primary,
  pi.sort_order,
  pi.image_type
FROM public.property_images_final_2026_02_21_17_30 pi
WHERE pi.property_id IN (
  SELECT id FROM public.properties_final_2026_02_21_17_30 
  WHERE is_featured = true AND is_published = true 
  LIMIT 5
)
ORDER BY pi.property_id, pi.sort_order;

-- 3. 验证所有必要的表都存在且有数据
SELECT 
  'Table Status' as check_type,
  'properties' as table_name,
  COUNT(*) as record_count
FROM public.properties_final_2026_02_21_17_30
UNION ALL
SELECT 
  'Table Status' as check_type,
  'areas' as table_name,
  COUNT(*) as record_count
FROM public.property_areas_final_2026_02_21_17_30
UNION ALL
SELECT 
  'Table Status' as check_type,
  'types' as table_name,
  COUNT(*) as record_count
FROM public.property_types_final_2026_02_21_17_30
UNION ALL
SELECT 
  'Table Status' as check_type,
  'images' as table_name,
  COUNT(*) as record_count
FROM public.property_images_final_2026_02_21_17_30;