-- 检查 RR370301 的 amenities 字段
SELECT 
  id, 
  title_zh,
  amenities_zh,
  amenities_en,
  CASE 
    WHEN amenities_zh IS NULL THEN 'NULL'
    WHEN array_length(amenities_zh, 1) IS NULL THEN 'Empty Array'
    ELSE 'Has Data: ' || array_length(amenities_zh, 1)::text || ' items'
  END as zh_status,
  CASE 
    WHEN amenities_en IS NULL THEN 'NULL'
    WHEN array_length(amenities_en, 1) IS NULL THEN 'Empty Array'
    ELSE 'Has Data: ' || array_length(amenities_en, 1)::text || ' items'
  END as en_status
FROM properties
WHERE id = 'RR370301';