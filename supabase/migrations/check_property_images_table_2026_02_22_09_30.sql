-- 检查property_images表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'property_images'
ORDER BY ordinal_position;

-- 检查现有数据
SELECT * FROM public.property_images LIMIT 5;