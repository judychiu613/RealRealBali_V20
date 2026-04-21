-- 为房产添加图片数据
WITH property_lookup AS (
  SELECT id, slug FROM public.properties_2026_02_21_08_00
)
INSERT INTO public.property_images_2026_02_21_08_00 (
  property_id, image_url, is_primary, sort_order, image_type
)
-- prop-001 的图片
SELECT 
  (SELECT id FROM property_lookup WHERE slug = 'prop-001'),
  'https://images.unsplash.com/photo-1703135387362-4b749023e1e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBiZWFjaGZyb250JTIwdmlsbGElMjBvY2VhbiUyMHZpZXclMjBzdW5zZXR8ZW58MHwwfHxibHVlfDE3NzA4OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  true, 1, 'exterior'
UNION ALL SELECT 
  (SELECT id FROM property_lookup WHERE slug = 'prop-001'),
  'https://images.unsplash.com/photo-1585216658790-094546fa88e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw0fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  false, 2, 'interior'
UNION ALL SELECT 
  (SELECT id FROM property_lookup WHERE slug = 'prop-001'),
  'https://images.unsplash.com/photo-1567491634123-460945ea86dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw5fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  false, 3, 'view'
UNION ALL SELECT 
  (SELECT id FROM property_lookup WHERE slug = 'prop-001'),
  'https://images.unsplash.com/photo-1711948728889-614d5d0030f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw4fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  false, 4, 'general'

-- prop-002 的图片
UNION ALL SELECT 
  (SELECT id FROM property_lookup WHERE slug = 'prop-002'),
  'https://images.unsplash.com/photo-1760564019062-7e7efdf4cc1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGluZmluaXR5JTIwcG9vbCUyMG9jZWFuJTIwdmlld3xlbnwwfDB8fHwxNzcwODk1ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  true, 1, 'exterior'
UNION ALL SELECT 
  (SELECT id FROM property_lookup WHERE slug = 'prop-002'),
  'https://images.unsplash.com/photo-1548386704-23fc0135faab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080',
  false, 2, 'view'
UNION ALL SELECT 
  (SELECT id FROM property_lookup WHERE slug = 'prop-002'),
  'https://images.unsplash.com/photo-1626724657306-1e58a0b111b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw4fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080',
  false, 3, 'interior'
UNION ALL SELECT 
  (SELECT id FROM property_lookup WHERE slug = 'prop-002'),
  'https://images.unsplash.com/photo-1760681552499-eeecfa20d110?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080',
  false, 4, 'general';