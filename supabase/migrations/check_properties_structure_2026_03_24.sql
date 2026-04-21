-- 查看properties表的所有列名
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
ORDER BY ordinal_position;

-- 查看第一条房源数据（只显示部分字段）
SELECT id, title_zh, 
       jsonb_object_keys(to_jsonb(properties.*)) as all_keys
FROM properties 
LIMIT 1;