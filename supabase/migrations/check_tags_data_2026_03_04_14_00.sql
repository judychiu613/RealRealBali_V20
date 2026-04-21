-- 检查前5条记录的tags相关字段
SELECT 
  id,
  title_zh,
  CASE 
    WHEN tags_zh IS NOT NULL THEN tags_zh
    ELSE 'NULL'::text[]
  END as tags_zh_value,
  CASE 
    WHEN tags_en IS NOT NULL THEN tags_en  
    ELSE 'NULL'::text[]
  END as tags_en_value
FROM properties 
WHERE status = 'Available'
ORDER BY created_at DESC
LIMIT 5;