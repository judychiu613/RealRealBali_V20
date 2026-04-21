-- 检查房源表的所有字段
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30'
ORDER BY ordinal_position;