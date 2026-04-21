-- 检查未发布的别墅

-- 查看所有别墅的发布状态
SELECT 
    id, title_zh, is_published, is_featured, created_at
FROM public.properties 
WHERE type_id = 'villa'
ORDER BY id;

-- 更新所有别墅为已发布状态
UPDATE public.properties 
SET is_published = true, updated_at = now()
WHERE type_id = 'villa' AND is_published = false;

-- 验证更新结果
SELECT 
    COUNT(*) as total_villas,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_villas
FROM public.properties 
WHERE type_id = 'villa';