-- 查看id=1的房源价格
SELECT id, title_zh, price_usd, price_cny, price_idr
FROM properties 
WHERE id = '1'
LIMIT 1;

-- 如果id=1不存在，查看前3条房源的价格
SELECT id, title_zh, price_usd, price_cny, price_idr
FROM properties 
ORDER BY created_at DESC
LIMIT 3;