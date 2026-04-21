-- 验证前5个房产的图片配置
SELECT 
  p.slug as property_id,
  p.title_zh as property_title,
  pi.sort_order,
  pi.image_type,
  pi.is_primary,
  SUBSTRING(pi.image_url FROM 'photo-([a-zA-Z0-9-]+)') as image_id
FROM public.properties_2026_02_21_08_00 p
JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id
WHERE p.slug IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
ORDER BY p.slug, pi.sort_order;