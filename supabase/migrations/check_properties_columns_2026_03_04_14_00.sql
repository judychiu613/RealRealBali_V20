-- 检查properties表的所有列
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND table_schema = 'public'
ORDER BY ordinal_position;