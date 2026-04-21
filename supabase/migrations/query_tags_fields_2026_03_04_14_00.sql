-- 查询前3条记录，检查tags_zh和tags_en字段
SELECT 
  id,
  title_zh,
  tags_zh,
  tags_en,
  is_featured
FROM properties 
WHERE status = 'Available'
ORDER BY created_at DESC
LIMIT 3;