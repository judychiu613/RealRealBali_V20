-- 验证property_images表数据
SELECT property_id, sort_order, 
       SUBSTRING(image_url, 1, 50) || '...' as image_url_preview
FROM public.property_images 
WHERE property_id IN ('prop-001', 'prop-002', 'prop-003')
ORDER BY property_id, sort_order;

-- 统计每个房源的图片数量
SELECT property_id, COUNT(*) as image_count
FROM public.property_images 
GROUP BY property_id
ORDER BY property_id
LIMIT 10;