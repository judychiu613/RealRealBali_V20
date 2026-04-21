-- 检查property_images表中的数据
SELECT property_id, image_url, sort_order
FROM public.property_images 
WHERE property_id = 'prop-001'
ORDER BY sort_order;

-- 检查表结构
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'property_images'
ORDER BY ordinal_position;