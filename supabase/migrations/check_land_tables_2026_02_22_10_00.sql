-- 检查所有表名
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%land%'
ORDER BY table_name;