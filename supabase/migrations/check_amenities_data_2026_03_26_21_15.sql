-- 检查 RR370301 房源的 amenities 字段
SELECT id, title_zh, amenities_zh, amenities_en
FROM properties
WHERE id = 'RR370301';

-- 检查是否有任何房源有 amenities 数据
SELECT id, title_zh, 
  CASE 
    WHEN amenities_zh IS NOT NULL AND array_length(amenities_zh, 1) > 0 THEN 'Has amenities_zh'
    ELSE 'No amenities_zh'
  END as zh_status,
  CASE 
    WHEN amenities_en IS NOT NULL AND array_length(amenities_en, 1) > 0 THEN 'Has amenities_en'
    ELSE 'No amenities_en'
  END as en_status
FROM properties
LIMIT 5;