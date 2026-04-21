-- 检查property_images表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'property_images'
ORDER BY ordinal_position;

-- 检查现有数据
SELECT property_id, image_url, sort_order, is_main, alt_text
FROM public.property_images 
ORDER BY property_id, sort_order
LIMIT 10;