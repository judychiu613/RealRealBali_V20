-- 查看property_image表的列结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'property_image' 
ORDER BY ordinal_position;

-- 查看property_image表中是否有property_id='1'的图片
SELECT property_id, image_url, sort_order
FROM property_image
WHERE property_id = '1'
ORDER BY sort_order
LIMIT 5;

-- 如果没有，查看前5条图片记录
SELECT property_id, image_url, sort_order
FROM property_image
ORDER BY created_at DESC
LIMIT 5;