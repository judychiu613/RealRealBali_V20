-- 检查前3条记录的描述字段
SELECT 
  id,
  title_zh,
  description_zh,
  description_en,
  CASE 
    WHEN description_zh IS NULL THEN 'NULL'
    WHEN description_zh = '' THEN 'EMPTY'
    ELSE 'HAS_DATA'
  END as zh_status,
  CASE 
    WHEN description_en IS NULL THEN 'NULL'
    WHEN description_en = '' THEN 'EMPTY'
    ELSE 'HAS_DATA'
  END as en_status
FROM properties 
WHERE status = 'Available'
ORDER BY created_at DESC
LIMIT 3;