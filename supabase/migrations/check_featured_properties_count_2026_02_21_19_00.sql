-- 检查有多少个房产被标记为精选
SELECT 
  COUNT(*) as total_properties,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_properties,
  COUNT(CASE WHEN is_featured = false THEN 1 END) as non_featured_properties
FROM public.properties_final_2026_02_21_17_30
WHERE is_published = true;