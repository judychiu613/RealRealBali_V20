-- 检查前3条记录的描述字段内容
SELECT 
  id,
  title_zh,
  description_zh,
  description_en,
  LENGTH(description_zh) as zh_length,
  LENGTH(description_en) as en_length
FROM properties 
WHERE status = 'Available'
ORDER BY created_at DESC
LIMIT 3;