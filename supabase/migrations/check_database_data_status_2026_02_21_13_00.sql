-- 检查房产数据状态
SELECT 
  COUNT(*) as total_properties,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_properties
FROM public.properties_2026_02_21_08_00;

-- 查看房产列表
SELECT 
  slug,
  title_zh,
  title_en,
  price_usd,
  bedrooms,
  bathrooms,
  is_featured
FROM public.properties_2026_02_21_08_00
ORDER BY slug;

-- 检查图片数据
SELECT 
  p.slug,
  COUNT(pi.id) as image_count,
  COUNT(CASE WHEN pi.is_primary = true THEN 1 END) as primary_images
FROM public.properties_2026_02_21_08_00 p
LEFT JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id
GROUP BY p.slug, p.title_zh
ORDER BY p.slug;