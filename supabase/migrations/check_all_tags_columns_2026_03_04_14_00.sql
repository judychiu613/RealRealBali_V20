-- 查看properties表中所有包含'tags'的字段
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND table_schema = 'public'
AND column_name LIKE '%tag%'
ORDER BY column_name;