-- 插入房产数据（使用正确的枚举类型）
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
  -8.5069, 115.2625, true;