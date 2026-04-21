-- 检查房产图片数据的完整性
-- 查看每个房产有多少张图片
SELECT 
  p.slug,
  p.title_zh,
  COUNT(pi.id) as image_count,
  ARRAY_AGG(pi.image_url ORDER BY pi.sort_order) as all_images
FROM public.properties_2026_02_21_08_00 p
LEFT JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id
WHERE p.slug IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
GROUP BY p.id, p.slug, p.title_zh
ORDER BY p.slug;

-- 检查是否有房产没有图片
SELECT 
  COUNT(*) as properties_without_images
FROM public.properties_2026_02_21_08_00 p
LEFT JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id
WHERE pi.id IS NULL;