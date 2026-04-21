-- 测试房产API返回的图片数据
-- 模拟Edge Function的查询逻辑
SELECT 
  p.slug,
  p.title_zh,
  p.title_en,
  p.price_usd,
  a.name_zh as area_name,
  t.name_zh as type_name,
  -- 主图片 (is_primary = true)
  (SELECT pi.image_url FROM public.property_images_2026_02_21_08_00 pi 
   WHERE pi.property_id = p.id AND pi.is_primary = true LIMIT 1) as main_image,
  -- 所有图片按sort_order排序
  ARRAY(
    SELECT pi.image_url 
    FROM public.property_images_2026_02_21_08_00 pi 
    WHERE pi.property_id = p.id 
    ORDER BY pi.sort_order
  ) as all_images
FROM public.properties_2026_02_21_08_00 p
LEFT JOIN public.property_areas_2026_02_21_08_00 a ON p.area_id = a.id
LEFT JOIN public.property_types_2026_02_21_08_00 t ON p.type_id = t.id
WHERE p.slug IN ('prop-001', 'prop-002', 'prop-003')
ORDER BY p.slug;