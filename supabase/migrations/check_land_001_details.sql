-- 查看land-001的完整信息
SELECT id, title_zh, price_usd, price_cny, price_idr, 
       land_area, building_area, type_id,
       ownership, status
FROM properties 
WHERE id = 'land-001'
LIMIT 1;