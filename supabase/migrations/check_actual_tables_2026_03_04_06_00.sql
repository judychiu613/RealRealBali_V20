-- 检查实际存在的表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 检查properties表的结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'properties' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查properties表的数据
SELECT 
    COUNT(*) as total_properties,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_properties
FROM properties;

-- 查看前5条properties数据
SELECT id, title_zh, title_en, type_id, area_id, price_usd, is_published, created_at
FROM properties 
ORDER BY created_at DESC 
LIMIT 5;