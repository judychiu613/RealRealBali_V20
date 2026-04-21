-- 检查前5条记录的tags相关字段
SELECT 
  id,
  title_zh,
  tags_zh,
  tags_en
FROM properties 
WHERE status = 'Available'
ORDER BY created_at DESC
LIMIT 5;