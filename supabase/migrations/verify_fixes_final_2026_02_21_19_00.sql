-- 验证修复后的数据状态

-- 1. 验证图片数据完整性
SELECT 
  'Image Data Status' as check_type,
  COUNT(*) as total_images,
  COUNT(DISTINCT property_id) as properties_with_images,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_images,
  COUNT(CASE WHEN image_url LIKE '%ixlib=rb-4.0.3%' THEN 1 END) as optimized_urls
FROM public.property_images_final_2026_02_21_17_30;

-- 2. 检查每个房产的图片状态
SELECT 
  p.id,
  p.title_zh,
  COUNT(pi.id) as image_count,
  COUNT(CASE WHEN pi.is_primary = true THEN 1 END) as primary_count,
  pi_primary.image_url as primary_image_url
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi_primary ON p.id = pi_primary.property_id AND pi_primary.is_primary = true
WHERE p.is_featured = true AND p.is_published = true
GROUP BY p.id, p.title_zh, pi_primary.image_url
ORDER BY p.id;

-- 3. 验证API数据格式（模拟Edge Function查询）
SELECT 
  p.id,
  p.title_zh,
  p.title_en,
  p.price_usd,
  p.is_featured,
  p.is_published,
  a.name_zh as area_name,
  pt.name_zh as type_name,
  COUNT(pi.id) as image_count
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_areas_final_2026_02_21_17_30 a ON p.area_id = a.id
LEFT JOIN public.property_types_final_2026_02_21_17_30 pt ON p.type_id = pt.id
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id
WHERE p.is_published = true
GROUP BY p.id, p.title_zh, p.title_en, p.price_usd, p.is_featured, p.is_published, a.name_zh, pt.name_zh
ORDER BY p.is_featured DESC, p.created_at DESC
LIMIT 10;