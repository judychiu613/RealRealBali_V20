-- 测试关联查询
SELECT 
  p.id,
  p.area_id,
  pa.id as area_table_id,
  pa.name_zh,
  pa.name_en
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_areas_final_2026_02_21_17_30 pa ON p.area_id = pa.id
WHERE p.id = 'prop-001';