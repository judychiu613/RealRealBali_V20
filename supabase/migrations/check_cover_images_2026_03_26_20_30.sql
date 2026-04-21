-- 检查前5个房源的图片字段
SELECT id, title_zh, cover_image
FROM properties
ORDER BY created_at DESC
LIMIT 5;