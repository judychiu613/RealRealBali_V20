-- 检查id=1的房源是否存在
SELECT id, title_zh, title_en, price, images, area_id, property_type 
FROM properties 
WHERE id = '1' OR id = 1
LIMIT 1;

-- 如果不存在，查看前3个房源的id
SELECT id, title_zh, title_en, price, images 
FROM properties 
ORDER BY created_at DESC 
LIMIT 3;