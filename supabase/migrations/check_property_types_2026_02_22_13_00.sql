-- 查看数据库中的房产类型分布

-- 查看所有房产的类型分布
SELECT 
    type_id,
    COUNT(*) as count,
    STRING_AGG(id, ', ') as property_ids
FROM public.properties 
GROUP BY type_id 
ORDER BY type_id;

-- 查看商业类型的具体房产
SELECT 
    id, title_zh, type_id, area_id, price_usd
FROM public.properties 
WHERE type_id = 'commercial'
ORDER BY id;

-- 查看别墅类型的具体房产
SELECT 
    id, title_zh, type_id, area_id, price_usd
FROM public.properties 
WHERE type_id = 'villa'
ORDER BY id;