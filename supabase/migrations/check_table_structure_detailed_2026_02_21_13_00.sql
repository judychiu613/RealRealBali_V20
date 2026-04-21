-- 查看房产表的完整结构
\d public.properties_2026_02_21_08_00;

-- 或者使用标准SQL查询
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'properties_2026_02_21_08_00'
ORDER BY ordinal_position;