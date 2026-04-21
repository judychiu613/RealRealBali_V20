-- 检查房产图片数据质量
SELECT 
  p.id as property_id,
  p.title_zh,
  COUNT(pi.id) as image_count,
  STRING_AGG(pi.image_url, '; ') as all_image_urls,
  STRING_AGG(pi.image_type, ', ') as image_types
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id
GROUP BY p.id, p.title_zh
ORDER BY p.id
LIMIT 10;