-- 查找 freehold 房源
SELECT id, title_zh, ownership
FROM properties
WHERE ownership = 'freehold'
LIMIT 1;