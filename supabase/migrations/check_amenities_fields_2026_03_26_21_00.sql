-- 查看包含 amenities 或 features 或 facilities 的列名
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND table_schema = 'public'
  AND (column_name LIKE '%amenities%' 
    OR column_name LIKE '%features%' 
    OR column_name LIKE '%facilities%'
    OR column_name LIKE '%facility%')
ORDER BY ordinal_position;

-- 查看 RR370301 房源的所有字段（看看有没有相关数据）
SELECT column_name
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND table_schema = 'public'
ORDER BY ordinal_position;