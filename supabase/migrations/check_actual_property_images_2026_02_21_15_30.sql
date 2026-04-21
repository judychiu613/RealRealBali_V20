-- 查看数据库中实际的房产图片数据
-- 检查前3个房产的完整图片信息
SELECT 
  p.slug as property_id,
  p.title_zh as property_title,
  pi.sort_order,
  pi.image_type,
  pi.is_primary,
  pi.image_url
FROM public.properties_2026_02_21_08_00 p
JOIN public.property_images_2026_02_21_08_00 pi ON p.id = pi.property_id
WHERE p.slug IN ('prop-001', 'prop-002', 'prop-003')
ORDER BY p.slug, pi.sort_order;

-- 同时检查Edge Function的数据转换
-- 测试单个房产的API返回