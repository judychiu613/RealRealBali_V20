-- 验证每个房源的图片数量分配
SELECT 
    property_id,
    COUNT(*) as image_count,
    STRING_AGG(sort_order::text, ',' ORDER BY sort_order) as sort_orders
FROM public.property_images 
GROUP BY property_id
ORDER BY property_id
LIMIT 20;

-- 统计图片数量分布
SELECT 
    image_count,
    COUNT(*) as properties_count,
    STRING_AGG(property_id, ', ' ORDER BY property_id) as property_ids
FROM (
    SELECT property_id, COUNT(*) as image_count
    FROM public.property_images 
    GROUP BY property_id
) counts
GROUP BY image_count
ORDER BY image_count;