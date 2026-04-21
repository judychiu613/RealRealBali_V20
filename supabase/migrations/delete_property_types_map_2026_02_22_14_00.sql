-- 删除property_types_map表并简化筛选逻辑

-- 首先检查当前的properties表中type_id分布
SELECT 
    type_id,
    COUNT(*) as count,
    STRING_AGG(id, ', ' ORDER BY id) as property_ids
FROM public.properties 
WHERE is_published = true
GROUP BY type_id 
ORDER BY type_id;

-- 删除property_types_map表
DROP TABLE IF EXISTS public.property_types_map CASCADE;

-- 验证删除结果
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%type%';