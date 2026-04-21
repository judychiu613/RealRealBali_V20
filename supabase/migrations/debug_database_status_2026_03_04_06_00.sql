-- 检查数据库状态和可能的问题

-- 1. 检查properties表的基本状态
SELECT 
    COUNT(*) as total_properties,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as available_properties,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_properties,
    COUNT(CASE WHEN created_by IS NOT NULL THEN 1 END) as properties_with_creator
FROM properties;

-- 2. 检查是否有properties数据
SELECT id, title_zh, title_en, type_id, status, is_published, created_at
FROM properties 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. 检查property_images表
SELECT 
    COUNT(*) as total_images,
    COUNT(DISTINCT property_id) as properties_with_images
FROM property_images;

-- 4. 检查areas表
SELECT COUNT(*) as total_areas FROM areas;

-- 5. 检查是否有RLS策略问题
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('properties', 'property_images', 'areas')
ORDER BY tablename, policyname;

-- 6. 测试一个简单的查询，模拟Edge Function的查询
SELECT 
    p.id,
    p.title_zh,
    p.title_en,
    p.type_id,
    p.price_usd,
    p.status,
    p.is_published,
    a.name_zh as area_name_zh,
    a.name_en as area_name_en
FROM properties p
LEFT JOIN areas a ON p.area_id = a.id
WHERE p.is_published = true 
  AND p.status = 'available'
ORDER BY p.created_at DESC
LIMIT 3;