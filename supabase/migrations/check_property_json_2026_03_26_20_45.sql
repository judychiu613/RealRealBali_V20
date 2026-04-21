-- 查看一个房源的所有字段（使用JSON格式更清晰）
SELECT json_build_object(
  'id', id,
  'title_zh', title_zh,
  'all_columns', to_jsonb(properties.*)
) as property_data
FROM properties
WHERE id = 'RR370301'
LIMIT 1;