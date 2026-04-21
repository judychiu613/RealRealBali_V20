-- 验证精选房产修复效果
-- 1. 查看最终的精选房产统计
SELECT 
  'Final Status' as check_type,
  COUNT(*) as total_properties,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count,
  COUNT(CASE WHEN is_published = true THEN 1 END) as published_count,
  COUNT(CASE WHEN is_featured = true AND is_published = true THEN 1 END) as featured_and_published
FROM public.properties_2026_02_21_08_00;

-- 2. 列出所有精选房产
SELECT 
  slug,
  title_zh,
  price_usd,
  is_featured,
  is_published
FROM public.properties_2026_02_21_08_00
WHERE is_featured = true AND is_published = true
ORDER BY price_usd DESC
LIMIT 20;

-- 3. 验证图片数据完整性
SELECT 
  'Image Data Check' as check_type,
  COUNT(DISTINCT p.id) as properties_with_images,
  COUNT(pi.id) as total_images,
  ROUND(COUNT(pi.id)::numeric / COUNT(DISTINCT p.id), 2) as avg_images_per_property
FROM public.properties_2026_02_21_08_00 p
JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id
WHERE p.is_featured = true AND p.is_published = true;