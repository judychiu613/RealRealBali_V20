-- 检查房产表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查房产和区域的关联关系
SELECT 
  p.id,
  p.area_id,
  pa.name_zh,
  pa.name_en
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_areas_final_2026_02_21_17_30 pa ON p.area_id = pa.id
LIMIT 5;