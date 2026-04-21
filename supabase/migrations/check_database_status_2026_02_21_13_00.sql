-- 检查当前数据库表和数据状态
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name LIKE '%propert%'
ORDER BY table_name, ordinal_position;

-- 检查房产表中的数据数量
SELECT 
  'properties_2026_02_21_08_00' as table_name,
  COUNT(*) as record_count
FROM public.properties_2026_02_21_08_00;

-- 查看现有房产数据的前几条
SELECT 
  id,
  title_zh,
  title_en,
  price_usd,
  location_zh,
  type_zh,
  bedrooms,
  bathrooms
FROM public.properties_2026_02_21_08_00
LIMIT 10;