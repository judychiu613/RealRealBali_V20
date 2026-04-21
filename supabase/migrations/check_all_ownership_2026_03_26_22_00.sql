-- 查看所有房源的 ownership 字段
SELECT 
  id, 
  title_zh,
  ownership,
  CASE 
    WHEN ownership = 'Freehold' THEN '永久产权'
    WHEN ownership = 'Leasehold' THEN '租赁产权'
    ELSE '未设置: ' || COALESCE(ownership, 'NULL')
  END as ownership_display
FROM properties
ORDER BY created_at DESC
LIMIT 10;

-- 统计各种产权类型的数量
SELECT 
  ownership,
  COUNT(*) as count
FROM properties
GROUP BY ownership;