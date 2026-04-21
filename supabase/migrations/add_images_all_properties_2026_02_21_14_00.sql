-- 为所有房产批量添加图片数据
-- 使用通用的高质量房产图片URL
WITH property_lookup AS (
  SELECT id, slug FROM public.properties_2026_02_21_08_00
),
image_urls AS (
  SELECT 
    'https://images.unsplash.com/photo-1703135387362-4b749023e1e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBiZWFjaGZyb250JTIwdmlsbGElMjBvY2VhbiUyMHZpZXclMjBzdW5zZXR8ZW58MHwwfHxibHVlfDE3NzA4OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080' as url1,
    'https://images.unsplash.com/photo-1585216658790-094546fa88e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw0fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080' as url2,
    'https://images.unsplash.com/photo-1567491634123-460945ea86dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw5fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080' as url3,
    'https://images.unsplash.com/photo-1711948728889-614d5d0030f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw4fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080' as url4
)
INSERT INTO public.property_images_2026_02_21_08_00 (
  property_id, image_url, is_primary, sort_order, image_type
)
-- 为每个房产生成4张图片
SELECT 
  p.id as property_id,
  CASE 
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.slug)) % 4 = 1 THEN i.url1
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.slug)) % 4 = 2 THEN i.url2
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.slug)) % 4 = 3 THEN i.url3
    ELSE i.url4
  END as image_url,
  CASE WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.slug)) % 4 = 1 THEN true ELSE false END as is_primary,
  (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.slug)) % 4 + 1 as sort_order,
  CASE 
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.slug)) % 4 = 1 THEN 'exterior'
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.slug)) % 4 = 2 THEN 'interior'
    WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.slug)) % 4 = 3 THEN 'view'
    ELSE 'general'
  END as image_type
FROM public.properties_2026_02_21_08_00 p
CROSS JOIN image_urls i
CROSS JOIN generate_series(1, 4) as series;