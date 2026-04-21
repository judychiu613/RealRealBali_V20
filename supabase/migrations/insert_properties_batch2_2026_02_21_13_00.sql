-- 插入更多房产数据（第二批）
WITH area_lookup AS (
  SELECT id, slug FROM public.property_areas_2026_02_21_08_00
),
type_lookup AS (
  SELECT id, slug FROM public.property_types_2026_02_21_08_00
)
INSERT INTO public.properties_2026_02_21_08_00 (
  id, title_en, title_zh, slug, description_en, description_zh,
  area_id, type_id, price_usd, bedrooms, bathrooms, 
  building_area, land_area, status, ownership, 
  tags_en, tags_zh, latitude, longitude, is_featured
) 
SELECT 
  gen_random_uuid(),
  'Minimalist Pererenan', '佩雷雷南极简雅舍', 'prop-004',
  'Located in an emerging high-end community, this villa features pure white lines and warm wood tones.',
  '位于新兴的高端社区，这座别墅以纯净的白色线条与温暖的木质色调为基调。其独特的挑高设计与自然采光极佳。',
  (SELECT id FROM area_lookup WHERE slug = 'pererenan'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1100000, 3, 3.5, 380, 520, 'available'::property_status, 'leasehold'::property_ownership,
  '["Beach 500m", "Natural Views"]'::jsonb,
  '["靠海滩500米", "自然风景房"]'::jsonb,
  -8.6416, 115.1235, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Urban Oasis Villa', '都会绿洲', 'prop-005',
  'A peaceful oasis in the bustling center of Seminyak. Modern architectural style with top-tier tech.',
  '在繁华的塞米亚克中心，开辟出一片宁静的绿洲。建筑风格现代干练，配备顶级品牌的智能家居系统。',
  (SELECT id FROM area_lookup WHERE slug = 'seminyak'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1550000, 4, 4, 460, 650, 'available'::property_status, 'leasehold'::property_ownership,
  '["Smart Home", "City Center"]'::jsonb,
  '["智能家居", "市中心"]'::jsonb,
  -8.6913, 115.1682, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Sunset Coast Estate', '日落海岸庄园', 'prop-006',
  'An expansive beachfront estate with direct access to Jimbaran beach, including private gym and cinema.',
  '占地极广的海滨庄园，直通金巴兰细腻的沙滩。庄园内部包含私人影院、健身房及专业的酒窖。',
  (SELECT id FROM area_lookup WHERE slug = 'jimbaran'),
  (SELECT id FROM type_lookup WHERE slug = 'beachfront-property'),
  2200000, 6, 7, 1200, 1800, 'available'::property_status, 'freehold'::property_ownership,
  '["Ocean View", "Private Beach", "Cinema", "Gym"]'::jsonb,
  '["海景房", "私人沙滩", "私人影院", "健身房"]'::jsonb,
  -8.7849, 115.1527, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Emerald Valley Estate', '翡翠谷庄园', 'prop-007',
  'A boutique villa hidden in Ubud''s rainforest with stunning rice terrace views.',
  '隐匿在乌布热带雨林中的精品别墅，享有壮丽的梯田景观。传统巴厘岛建筑与现代舒适完美结合。',
  (SELECT id FROM area_lookup WHERE slug = 'ubud-center'),
  (SELECT id FROM type_lookup WHERE slug = 'mountain-villa'),
  980000, 3, 3, 350, 800, 'available'::property_status, 'leasehold'::property_ownership,
  '["Mountain View", "Natural Views", "Rice Terraces"]'::jsonb,
  '["山景房", "自然风景房", "稻田景观"]'::jsonb,
  -8.5069, 115.2624, false;