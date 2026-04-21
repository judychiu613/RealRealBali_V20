-- 查看前5条房源的id和基本信息
SELECT id, title_zh, title_en, price_usd, property_type, area_id
FROM properties 
ORDER BY created_at DESC 
LIMIT 5;

-- 检查是否有id='1'的房源
SELECT COUNT(*) as count FROM properties WHERE id = '1';