-- 检查property_images表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'property_images'
ORDER BY ordinal_position;

-- 检查现有数据（不包含is_main字段）
SELECT property_id, image_url, sort_order, alt_text
FROM public.property_images 
ORDER BY property_id, sort_order
LIMIT 10;