-- 检查properties表结构
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查areas表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'areas' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查amenities相关表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%amenity%' OR table_name LIKE '%amenities%';