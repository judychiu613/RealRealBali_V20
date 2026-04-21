-- 删除商业类型房产及相关数据

-- 首先删除商业房产的图片
DELETE FROM public.property_images 
WHERE property_id IN (
    SELECT id FROM public.properties WHERE type_id = 'commercial'
);

-- 删除商业房产的收藏记录
DELETE FROM public.user_favorites_map 
WHERE property_id IN (
    SELECT id FROM public.properties WHERE type_id = 'commercial'
);

-- 删除商业类型的房产
DELETE FROM public.properties 
WHERE type_id = 'commercial';

-- 删除商业类型映射
DELETE FROM public.property_types_map 
WHERE id = 'commercial';

-- 验证删除结果
SELECT 
    'properties' as table_name,
    type_id,
    COUNT(*) as remaining_count
FROM public.properties 
GROUP BY type_id 
ORDER BY type_id;

-- 验证类型映射表
SELECT 
    'property_types_map' as table_name,
    id, name_en, name_zh
FROM public.property_types_map 
ORDER BY id;