-- 验证房产图片分配的多样性
-- 检查前10个房产的图片分配情况
SELECT 
  p.slug as property_slug,
  p.title_zh as property_title,
  pi.sort_order,
  pi.image_type,
  pi.is_primary,
  SUBSTRING(pi.image_url FROM 'photo-([^?]+)') as image_id
FROM public.properties_2026_02_21_08_00 p
JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id
WHERE p.slug IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
ORDER BY p.slug, pi.sort_order;

-- 统计每个图片URL被使用的次数
SELECT 
  SUBSTRING(image_url FROM 'photo-([^?]+)') as image_id,
  COUNT(*) as usage_count
FROM public.property_images_2026_02_21_08_00
GROUP BY SUBSTRING(image_url FROM 'photo-([^?]+)')
ORDER BY usage_count DESC;