-- 检查数据库中精选房产的设置
-- 1. 查看所有房产的精选状态
SELECT 
  slug,
  title_zh,
  title_en,
  is_featured,
  is_published,
  created_at
FROM public.properties_2026_02_21_08_00
ORDER BY slug;

-- 2. 统计精选房产数量
SELECT 
  COUNT(*) as total_properties,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count,
  COUNT(CASE WHEN is_published = true THEN 1 END) as published_count,
  COUNT(CASE WHEN is_featured = true AND is_published = true THEN 1 END) as featured_and_published
FROM public.properties_2026_02_21_08_00;

-- 3. 查看精选房产的详细信息
SELECT 
  slug,
  title_zh,
  title_en,
  price_usd,
  is_featured,
  is_published
FROM public.properties_2026_02_21_08_00
WHERE is_featured = true
ORDER BY slug;