-- 检查前5个房产的具体图片URL
SELECT 
  p.id,
  p.title_zh,
  pi.image_url,
  pi.image_type,
  pi.sort_order,
  LENGTH(pi.image_url) as url_length
FROM public.properties_final_2026_02_21_17_30 p
JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id
WHERE p.id IN ('prop-001', 'prop-002', 'prop-003')
ORDER BY p.id, pi.sort_order;