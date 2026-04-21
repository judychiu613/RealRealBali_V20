-- 为所有房产插入图片数据

-- 为每个房产插入4张图片
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order)
SELECT 
  p.id,
  CASE 
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) - 1) % 4 = 0 THEN 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) - 1) % 4 = 1 THEN 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) - 1) % 4 = 2 THEN 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ELSE 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'
  END as image_url,
  CASE 
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) - 1) % 4 = 0 THEN 'exterior'
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) - 1) % 4 = 1 THEN 'interior'
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) - 1) % 4 = 2 THEN 'view'
    ELSE 'general'
  END as image_type,
  CASE WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) - 1) % 4 = 0 THEN true ELSE false END as is_primary,
  (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) - 1) % 4 + 1 as sort_order
FROM public.properties_final_2026_02_21_17_30 p
CROSS JOIN generate_series(1, 4) as series;

-- 验证图片插入结果
SELECT 
  'Image Data Check' as status,
  COUNT(*) as total_images,
  COUNT(DISTINCT property_id) as properties_with_images,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_images,
  ROUND(COUNT(*)::numeric / COUNT(DISTINCT property_id), 2) as avg_images_per_property
FROM public.property_images_final_2026_02_21_17_30;

-- 查看前5个房产的图片分布
SELECT 
  p.id,
  p.title_zh,
  COUNT(pi.id) as image_count,
  COUNT(CASE WHEN pi.is_primary = true THEN 1 END) as primary_count
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id
GROUP BY p.id, p.title_zh
ORDER BY p.id
LIMIT 5;