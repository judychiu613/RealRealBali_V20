-- 检查别墅数量和数据

-- 查看所有别墅
SELECT 
    COUNT(*) as total_villas,
    'villa' as type_id
FROM public.properties 
WHERE type_id = 'villa';

-- 查看所有别墅的详细信息
SELECT 
    id, title_zh, type_id, area_id, is_published, is_featured
FROM public.properties 
WHERE type_id = 'villa'
ORDER BY id;

-- 查看所有房产类型分布
SELECT 
    type_id,
    COUNT(*) as count,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_count,
    COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count
FROM public.properties 
GROUP BY type_id 
ORDER BY type_id;