-- 检查房源 RR370301 的标签数据
SELECT id, title_zh, tags_zh, tags_en
FROM properties
WHERE id = 'RR370301';

-- 检查前5个房源的标签数据
SELECT id, title_zh, tags_zh, tags_en
FROM properties
ORDER BY created_at DESC
LIMIT 5;