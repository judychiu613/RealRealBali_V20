-- 清空现有图片数据
TRUNCATE TABLE public.property_images_2026_02_21_08_00;

-- 重新添加多样化的房产图片
-- 使用更多不同的高质量房产图片URL
WITH property_list AS (
  SELECT id, slug, ROW_NUMBER() OVER (ORDER BY slug) as prop_num
  FROM public.properties_2026_02_21_08_00
),
image_pool AS (
  SELECT * FROM (VALUES
    ('https://images.unsplash.com/photo-1703135387362-4b749023e1e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBiZWFjaGZyb250JTIwdmlsbGElMjBvY2VhbiUyMHZpZXclMjBzdW5zZXR8ZW58MHwwfHxibHVlfDE3NzA4OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1585216658790-094546fa88e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw0fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1567491634123-460945ea86dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw5fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1711948728889-614d5d0030f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw4fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1548386704-23fc0135faab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1626724657306-1e58a0b111b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw4fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1760681552499-eeecfa20d110?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1619816733225-a25859428a75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1642330012430-3652a78a1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwcG9vbCUyMHZpbGxhJTIwc3Vuc2V0fGVufDB8MHx8fDE3NzA4ODg5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1762117360871-f11fbad00ee1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1759256243437-9c8f7238c42b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1760681555570-96b2f4f4a56c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1760681554226-197f4c977e42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1588294320552-b8de45e0bcaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw4fHxtb2Rlcm4lMjB2aWxsYSUyMGluZmluaXR5JTIwcG9vbCUyMG9jZWFuJTIwdmlld3xlbnwwfDB8fHwxNzcwODk1ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1732817206574-12c44c9c2a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjB2aWxsYSUyMGluZmluaXR5JTIwcG9vbCUyMG9jZWFuJTIwdmlld3xlbnwwfDB8fHwxNzcwODk1ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1610372992112-8c16a526b9c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjB2aWxsYSUyMGluZmluaXR5JTIwcG9vbCUyMG9jZWFuJTIwdmlld3xlbnwwfDB8fHwxNzcwODk1ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1760564019062-7e7efdf4cc1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGluZmluaXR5JTIwcG9vbCUyMG9jZWFuJTIwdmlld3xlbnwwfDB8fHwxNzcwODk1ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1760564019141-abe33455ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjB2aWxsYSUyMGluZmluaXR5JTIwcG9vbCUyMG9jZWFuJTIwdmlld3xlbnwwfDB8fHwxNzcwODk1ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080'),
    ('https://images.unsplash.com/photo-1760564019363-4fb6a294818d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjB2aWxsYSUyMGluZmluaXR5JTIwcG9vbCUyMG9jZWFuJTIwdmlld3xlbnwwfDB8fHwxNzcwODk1ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080')
  ) AS t(url)
),
numbered_images AS (
  SELECT url, ROW_NUMBER() OVER () as img_num
  FROM image_pool
)
INSERT INTO public.property_images_2026_02_21_08_00 (
  property_id, image_url, is_primary, sort_order, image_type
)
SELECT 
  p.id as property_id,
  i.url as image_url,
  CASE WHEN s.img_order = 1 THEN true ELSE false END as is_primary,
  s.img_order as sort_order,
  CASE 
    WHEN s.img_order = 1 THEN 'exterior'
    WHEN s.img_order = 2 THEN 'interior'
    WHEN s.img_order = 3 THEN 'view'
    ELSE 'general'
  END as image_type
FROM property_list p
CROSS JOIN generate_series(1, 4) as s(img_order)
JOIN numbered_images i ON i.img_num = ((p.prop_num - 1) * 4 + s.img_order - 1) % 20 + 1;