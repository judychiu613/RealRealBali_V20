-- 检查id=1的房源是否存在
SELECT id, title_zh, title_en, price_usd, images, area_id, property_type 
FROM properties 
WHERE id = '1'
LIMIT 1;

-- 如果不存在，查看前5个房源的id和基本信息
SELECT id, title_zh, title_en, price_usd, 
       CASE WHEN images IS NOT NULL THEN jsonb_array_length(images) ELSE 0 END as image_count
FROM properties 
ORDER BY created_at DESC 
LIMIT 5;