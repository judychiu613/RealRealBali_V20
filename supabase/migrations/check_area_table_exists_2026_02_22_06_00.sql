-- 检查区域表是否存在
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%area%';

-- 尝试查询区域表
SELECT COUNT(*) FROM public.property_areas_final_2026_02_21_17_30;