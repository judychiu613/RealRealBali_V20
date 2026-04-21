-- 检查当前status字段的值
SELECT 
    status,
    COUNT(*) as count,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_count
FROM properties 
GROUP BY status;

-- 如果status字段为NULL或其他值，将其设置为'available'
UPDATE properties 
SET status = 'available' 
WHERE status IS NULL OR status != 'available';

-- 确保所有房源都是已发布状态
UPDATE properties 
SET is_published = true 
WHERE is_published IS NULL OR is_published = false;

-- 再次检查更新后的状态
SELECT 
    status,
    COUNT(*) as count,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_count
FROM properties 
GROUP BY status;

-- 查看更新后的数据
SELECT 
    id, 
    title_zh, 
    title_en, 
    type_id, 
    area_id, 
    price_usd, 
    is_published, 
    status,
    created_at
FROM properties 
WHERE is_published = true AND status = 'available'
ORDER BY created_at DESC 
LIMIT 5;