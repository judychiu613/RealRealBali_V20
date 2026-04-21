-- 列出所有精选房产的详细信息
SELECT 
  id,
  title_zh,
  title_en,
  is_featured,
  is_published,
  created_at
FROM public.properties_final_2026_02_21_17_30
WHERE is_published = true
ORDER BY is_featured DESC, created_at DESC;