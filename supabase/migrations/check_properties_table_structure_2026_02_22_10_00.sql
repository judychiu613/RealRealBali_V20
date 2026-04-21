-- 检查当前房源表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30' 
AND table_schema = 'public'
ORDER BY ordinal_position;