-- 检查当前数据库结构和数据
-- 1. 查看properties表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'properties_2026_02_21_08_00' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 查看当前的id和slug数据
SELECT 
  id,
  slug,
  title_zh,
  is_featured,
  is_published
FROM public.properties_2026_02_21_08_00
ORDER BY slug
LIMIT 10;

-- 3. 检查外键关系
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND (tc.table_name LIKE '%2026_02_21_08_00%' OR ccu.table_name LIKE '%2026_02_21_08_00%');