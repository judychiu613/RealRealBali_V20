-- 直接查询确认字段存在和数据
SELECT 
  id,
  title_zh,
  description_zh,
  description_en
FROM properties 
WHERE status = 'Available'
AND id = 'villa-009'
LIMIT 1;