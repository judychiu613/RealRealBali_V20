-- 批量导入房产数据（第1批：prop-001到prop-010）
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
  'The Basalt Sanctuary', '玄武岩之境', 'prop-001',
  'A quiet luxury masterpiece in the heart of Canggu, blending urban minimalism with tropical aesthetics.',
  '这座位于仓古核心区域的静奢杰作，完美融合了都会极简主义与巴厘岛的热带美学。开放式生活空间与无边界泳池无缝衔接。',
  (SELECT id FROM area_lookup WHERE slug = 'echo-beach'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1280000, 4, 4, 420, 600, 'available'::property_status, 'leasehold'::property_ownership,
  '["Beach 500m", "Natural Views"]'::jsonb,
  '["靠海滩500米", "自然风景房"]'::jsonb,
  -8.6478, 115.1385, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Horizon Azure', '蔚蓝地平线', 'prop-002',
  'Perched on the magnificent cliffs of Uluwatu with 270-degree unobstructed ocean views.',
  '坐落于乌鲁瓦图壮丽的断崖之上，拥有270度无死角海景。建筑采用大量石灰石与天然原木，营造出一种宁静而充满力量感的居住氛围。',
  (SELECT id FROM area_lookup WHERE slug = 'bingin'),
  (SELECT id FROM type_lookup WHERE slug = 'beachfront-villa'),
  3500000, 5, 6, 850, 1200, 'available'::property_status, 'freehold'::property_ownership,
  '["Ocean View", "Private Beach"]'::jsonb,
  '["海景房", "私人沙滩"]'::jsonb,
  -8.8449, 115.0849, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Forest Zen Retreat', '林间静邸', 'prop-003',
  'Surrounded by Ubud''s lush terraces and rainforest, this sanctuary offers a "less is more" design.',
  '被乌布翠绿的梯田与雨林包围，这里是远离尘嚣的避风港。室内设计强调"少即是多"，每一处细节都经过精心雕琢。',
  (SELECT id FROM area_lookup WHERE slug = 'ubud-center'),
  (SELECT id FROM type_lookup WHERE slug = 'eco-villa'),
  850000, 3, 3, 310, 450, 'available'::property_status, 'leasehold'::property_ownership,
  '["Natural Views", "Rice Terraces", "Spa Resort"]'::jsonb,
  '["自然风景房", "稻田景观", "温泉度假村"]'::jsonb,
  -8.5069, 115.2625, true

UNION ALL SELECT 
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
  -8.5069, 115.2624, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Sanur Serenity', '萨努尔宁静居', 'prop-008',
  'A tranquil beachfront villa in the peaceful Sanur area with traditional Balinese charm.',
  '位于宁静萨努尔区域的海滨别墅，充满传统巴厘岛魅力。',
  (SELECT id FROM area_lookup WHERE slug = 'sanur'),
  (SELECT id FROM type_lookup WHERE slug = 'beachfront-villa'),
  1350000, 4, 4, 400, 550, 'available'::property_status, 'leasehold'::property_ownership,
  '["Beach Access", "Traditional Design"]'::jsonb,
  '["海滩通道", "传统设计"]'::jsonb,
  -8.6807, 115.2633, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Canggu Surf Lodge', '仓古冲浪小屋', 'prop-009',
  'A modern surf villa just steps from the famous Canggu beach breaks.',
  '距离著名仓古海滩冲浪点仅几步之遥的现代冲浪别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'canggu'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1200000, 3, 3, 320, 480, 'available'::property_status, 'leasehold'::property_ownership,
  '["Surf Beach", "Modern Design"]'::jsonb,
  '["冲浪海滩", "现代设计"]'::jsonb,
  -8.6478, 115.1385, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Uluwatu Clifftop', '乌鲁瓦图悬崖顶', 'prop-010',
  'Dramatic clifftop villa with breathtaking ocean views and infinity pool.',
  '壮观的悬崖顶别墅，拥有令人惊叹的海景和无边际泳池。',
  (SELECT id FROM area_lookup WHERE slug = 'uluwatu'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  2800000, 5, 5, 600, 900, 'available'::property_status, 'freehold'::property_ownership,
  '["Cliff Views", "Infinity Pool"]'::jsonb,
  '["悬崖景观", "无边际泳池"]'::jsonb,
  -8.8449, 115.0849, true;