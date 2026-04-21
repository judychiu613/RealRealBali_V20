-- 检查数据库中的type_id分布

-- 查看所有房产的type_id分布
SELECT 
    type_id,
    COUNT(*) as count,
    STRING_AGG(id, ', ') as property_ids
FROM public.properties 
WHERE is_published = true
GROUP BY type_id 
ORDER BY type_id;

-- 查看type_id映射表
SELECT 
    id, name_en, name_zh
FROM public.property_types_map 
ORDER BY id;

-- 验证具体的房产数据
SELECT 
    id, title_zh, type_id, is_published
FROM public.properties 
WHERE type_id IN ('villa', 'land')
ORDER BY type_id, id;