-- 检查房产表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'properties_2026_02_21_08_00'
ORDER BY ordinal_position;

-- 检查房产数据数量
SELECT COUNT(*) as total_properties FROM public.properties_2026_02_21_08_00;

-- 查看现有房产数据
SELECT 
  id,
  title_zh,
  title_en,
  price_usd,
  bedrooms,
  bathrooms,
  status
FROM public.properties_2026_02_21_08_00
LIMIT 5;