-- 查看properties表中area_id的使用情况
SELECT 
  area_id,
  COUNT(*) as property_count
FROM public.properties 
GROUP BY area_id 
ORDER BY area_id;

-- 查看前10个房源的area_id
SELECT 
  id,
  area_id,
  type_id
FROM public.properties 
ORDER BY id
LIMIT 10;