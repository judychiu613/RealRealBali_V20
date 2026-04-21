-- 检查图片URL的有效性

-- 1. 查看所有图片URL
SELECT 
  property_id,
  image_url,
  is_primary,
  sort_order,
  image_type
FROM public.property_images_final_2026_02_21_17_30
ORDER BY property_id, sort_order;

-- 2. 检查是否有重复或无效的图片URL
SELECT 
  image_url,
  COUNT(*) as usage_count,
  STRING_AGG(property_id, ', ') as used_by_properties
FROM public.property_images_final_2026_02_21_17_30
GROUP BY image_url
HAVING COUNT(*) > 1
ORDER BY usage_count DESC;

-- 3. 检查每个房产的主图片
SELECT 
  p.id,
  p.title_zh,
  pi.image_url as primary_image,
  CASE 
    WHEN pi.image_url IS NULL THEN 'NO PRIMARY IMAGE'
    WHEN pi.image_url LIKE '%unsplash%' THEN 'UNSPLASH IMAGE'
    ELSE 'OTHER IMAGE'
  END as image_status
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id AND pi.is_primary = true
ORDER BY p.id;