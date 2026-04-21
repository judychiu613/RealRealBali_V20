-- 检查properties表是否存在数据
SELECT 
    COUNT(*) as total_count,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_count,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as available_count,
    COUNT(CASE WHEN is_published = true AND status = 'available' THEN 1 END) as published_and_available
FROM properties;

-- 查看前几条数据的详细信息
SELECT 
    id, 
    title_zh, 
    title_en, 
    type_id, 
    area_id, 
    price_usd, 
    is_published, 
    status,
    created_at
FROM properties 
ORDER BY created_at DESC 
LIMIT 10;

-- 检查property_images表
SELECT 
    COUNT(*) as total_images,
    COUNT(DISTINCT property_id) as properties_with_images
FROM property_images;

-- 查看一些图片数据
SELECT 
    property_id,
    image_url,
    sort_order
FROM property_images 
ORDER BY property_id, sort_order 
LIMIT 10;