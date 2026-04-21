-- 查看properties表的列结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;