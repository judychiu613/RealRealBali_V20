-- 查找所有表名
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%image%'
ORDER BY table_name;

-- 查找所有表名（包含property）
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%property%'
ORDER BY table_name;