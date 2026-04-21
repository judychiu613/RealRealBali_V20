-- 检查当前数据状态和API连接

-- 1. 查看所有房产数据
SELECT 
  id,
  title_zh,
  title_en,
  is_published,
  is_featured,
  price_usd,
  area_id,
  type_id
FROM public.properties_final_2026_02_21_17_30
ORDER BY id;

-- 2. 检查精选房产
SELECT 
  'Featured Properties' as check_type,
  COUNT(*) as count
FROM public.properties_final_2026_02_21_17_30
WHERE is_featured = true AND is_published = true;

-- 3. 检查图片数据
SELECT 
  property_id,
  COUNT(*) as image_count,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_count
FROM public.property_images_final_2026_02_21_17_30
GROUP BY property_id
ORDER BY property_id;

-- 4. 测试一个完整的房产查询（模拟API调用）
SELECT 
  p.*,
  a.name_zh as area_name_zh,
  a.name_en as area_name_en,
  pt.name_zh as type_name_zh,
  pt.name_en as type_name_en,
  pi.image_url,
  pi.is_primary,
  pi.sort_order
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_areas_final_2026_02_21_17_30 a ON p.area_id = a.id
LEFT JOIN public.property_types_final_2026_02_21_17_30 pt ON p.type_id = pt.id
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id
WHERE p.is_featured = true AND p.is_published = true
ORDER BY p.id, pi.sort_order
LIMIT 10;