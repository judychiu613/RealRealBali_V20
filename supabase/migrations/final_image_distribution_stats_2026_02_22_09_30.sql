-- 最终验证图片分配统计
SELECT 
    image_count,
    COUNT(*) as properties_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
FROM (
    SELECT property_id, COUNT(*) as image_count
    FROM public.property_images 
    GROUP BY property_id
) counts
GROUP BY image_count
ORDER BY image_count;

-- 显示前10个房源的详细信息
SELECT 
    p.property_id,
    p.image_count,
    SUBSTRING(pi.image_url, 1, 80) || '...' as first_image_preview
FROM (
    SELECT property_id, COUNT(*) as image_count
    FROM public.property_images 
    GROUP BY property_id
) p
LEFT JOIN public.property_images pi ON p.property_id = pi.property_id AND pi.sort_order = 1
ORDER BY p.property_id
LIMIT 10;