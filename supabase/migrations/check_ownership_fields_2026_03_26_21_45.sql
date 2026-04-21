-- 查看最新的5个房源的 ownership 字段
SELECT 
  id, 
  title_zh, 
  ownership,
  created_at
FROM properties
ORDER BY created_at DESC
LIMIT 5;

-- 查看所有永久产权的房源
SELECT 
  id, 
  title_zh, 
  ownership
FROM properties
WHERE ownership = 'Freehold'
ORDER BY created_at DESC
LIMIT 5;