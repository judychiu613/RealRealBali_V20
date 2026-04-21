-- 查看包含 image 的列名
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND table_schema = 'public'
  AND column_name LIKE '%image%'
ORDER BY ordinal_position;

-- 如果没有 image 字段，查看所有列
SELECT column_name
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND table_schema = 'public'
ORDER BY ordinal_position;