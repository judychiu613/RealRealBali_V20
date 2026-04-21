-- 测试1：检查数据库基本状态
SELECT 'properties表总数' as test_name, COUNT(*) as result FROM properties
UNION ALL
SELECT 'published房源数', COUNT(*) FROM properties WHERE is_published = true
UNION ALL
SELECT 'featured房源数', COUNT(*) FROM properties WHERE is_featured = true
UNION ALL
SELECT 'property_images总数', COUNT(*) FROM property_images
UNION ALL
SELECT '有图片的房源数', COUNT(DISTINCT property_id) FROM property_images;

-- 测试2：查看具体的房源数据
SELECT 
    '房源详情' as test_name,
    id, 
    title_zh, 
    title_en, 
    type_id, 
    area_id, 
    price_usd, 
    is_published, 
    is_featured,
    status
FROM properties 
ORDER BY created_at DESC 
LIMIT 3;

-- 测试3：查看图片数据
SELECT 
    '图片详情' as test_name,
    property_id,
    image_url,
    sort_order
FROM property_images 
ORDER BY property_id, sort_order 
LIMIT 5;