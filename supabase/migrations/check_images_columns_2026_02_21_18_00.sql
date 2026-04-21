-- 检查图片表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'property_images_final_2026_02_21_17_30' 
AND table_schema = 'public';