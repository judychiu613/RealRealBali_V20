-- 检查是否存在图片相关字段
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30'
AND column_name LIKE '%image%';

-- 如果没有图片字段，添加它们
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD COLUMN IF NOT EXISTS main_image TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[];

-- 为现有房源添加默认图片
UPDATE public.properties_final_2026_02_21_17_30 
SET main_image = COALESCE(main_image, '/images/default-property.jpg')
WHERE main_image IS NULL;

-- 为现有房源添加默认图片数组
UPDATE public.properties_final_2026_02_21_17_30 
SET images = COALESCE(images, ARRAY['/images/default-property.jpg'])
WHERE images IS NULL OR array_length(images, 1) IS NULL;