-- 查看 properties 表的所有列
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND table_schema = 'public'
ORDER BY ordinal_position;