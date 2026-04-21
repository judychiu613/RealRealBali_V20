-- 检查当前图片数据状态
SELECT 
  p.id,
  p.title_zh,
  COUNT(pi.id) as image_count,
  pi.image_url,
  pi.sort_order
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id
WHERE p.id IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
GROUP BY p.id, p.title_zh, pi.image_url, pi.sort_order
ORDER BY p.id, pi.sort_order;