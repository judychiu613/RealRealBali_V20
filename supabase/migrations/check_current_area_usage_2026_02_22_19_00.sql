-- 查看当前房源使用的area_id
SELECT 
  area_id,
  COUNT(*) as property_count,
  STRING_AGG(title->>'zh', ', ') as property_titles_zh
FROM public.properties 
GROUP BY area_id 
ORDER BY area_id;

-- 查看具体的area_id对应的区域信息
SELECT 
  p.area_id,
  p.title->>'zh' as title_zh,
  p.title->>'en' as title_en,
  p.type_id
FROM public.properties p
ORDER BY p.area_id, p.title->>'zh';