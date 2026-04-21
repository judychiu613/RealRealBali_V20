-- 检查当前房源类型表结构
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'property_types_final_2026_02_21_17_30'
ORDER BY ordinal_position;

-- 查看当前的房源类型数据
SELECT * FROM public.property_types_final_2026_02_21_17_30 ORDER BY id;