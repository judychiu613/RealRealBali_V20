-- 查找所有表名
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 如果property_images表存在，查看数据
SELECT COUNT(*) as total_images FROM public.property_images;

-- 查看前5条数据
SELECT * FROM public.property_images LIMIT 5;