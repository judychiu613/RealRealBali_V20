-- 查看所有表名
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%area%' OR table_name LIKE '%zone%' OR table_name LIKE '%map%')
ORDER BY table_name;