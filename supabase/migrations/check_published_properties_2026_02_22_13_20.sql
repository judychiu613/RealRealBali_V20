-- 检查所有已发布的房产数量

-- 查看所有已发布房产的类型分布
SELECT 
    type_id,
    COUNT(*) as count,
    COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count
FROM public.properties 
WHERE is_published = true
GROUP BY type_id 
ORDER BY type_id;

-- 查看所有房产的发布状态
SELECT 
    type_id,
    is_published,
    COUNT(*) as count
FROM public.properties 
GROUP BY type_id, is_published
ORDER BY type_id, is_published;

-- 查看最近创建的房产
SELECT 
    id, title_zh, type_id, is_published, created_at
FROM public.properties 
ORDER BY created_at DESC
LIMIT 20;