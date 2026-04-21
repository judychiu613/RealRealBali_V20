-- 验证所有房源的图片数量
SELECT property_id, COUNT(*) as image_count
FROM public.property_images 
GROUP BY property_id
HAVING COUNT(*) < 3
ORDER BY property_id;

-- 查看总体统计
SELECT 
    COUNT(DISTINCT property_id) as total_properties,
    COUNT(*) as total_images,
    ROUND(COUNT(*)::decimal / COUNT(DISTINCT property_id), 2) as avg_images_per_property
FROM public.property_images;