-- 检查是否有房源包含 tags_zh 数据
SELECT id, title_zh, tags_zh, tags_en
FROM properties
WHERE tags_zh IS NOT NULL AND array_length(tags_zh, 1) > 0
LIMIT 5;

-- 检查是否有房源包含 tags_en 数据
SELECT id, title_zh, tags_zh, tags_en
FROM properties
WHERE tags_en IS NOT NULL AND array_length(tags_en, 1) > 0
LIMIT 5;

-- 查看所有房源的标签字段状态
SELECT 
  COUNT(*) as total_properties,
  COUNT(CASE WHEN tags_zh IS NOT NULL AND array_length(tags_zh, 1) > 0 THEN 1 END) as has_tags_zh,
  COUNT(CASE WHEN tags_en IS NOT NULL AND array_length(tags_en, 1) > 0 THEN 1 END) as has_tags_en
FROM properties;