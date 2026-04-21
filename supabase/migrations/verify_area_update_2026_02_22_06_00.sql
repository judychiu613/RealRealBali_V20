-- 验证area更新结果
SELECT 
  p.id,
  p.area_id,
  pa.name_zh,
  pa.name_en,
  p.ownership,
  p.leasehold_years
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_areas_final_2026_02_21_17_30 pa ON p.area_id = pa.id
WHERE p.id IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
ORDER BY p.id;