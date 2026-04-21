-- 验证所有房产的图片数据完整性
SELECT 
  p.id,
  p.title_zh,
  COUNT(pi.id) as image_count,
  CASE WHEN COUNT(pi.id) = 0 THEN 'NO IMAGES' ELSE 'HAS IMAGES' END as status
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id
GROUP BY p.id, p.title_zh
ORDER BY p.id;