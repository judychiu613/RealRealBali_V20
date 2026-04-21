-- 批量导入房产数据（第2批：prop-011到prop-020）
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
  'Seminyak Luxury', '水明漾奢华居', 'prop-011',
  'Ultra-modern villa in the heart of Seminyak with world-class amenities.',
  '位于水明漾中心的超现代别墅，配备世界级设施。',
  (SELECT id FROM area_lookup WHERE slug = 'seminyak'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1800000, 4, 5, 500, 700, 'available'::property_status, 'leasehold'::property_ownership,
  '["Shopping District", "Restaurants"]'::jsonb,
  '["购物区", "餐厅"]'::jsonb,
  -8.6913, 115.1682, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Jimbaran Bay Villa', '金巴兰海湾别墅', 'prop-012',
  'Beachfront villa with direct access to Jimbaran''s famous seafood restaurants.',
  '海滨别墅，可直接前往金巴兰著名的海鲜餐厅。',
  (SELECT id FROM area_lookup WHERE slug = 'jimbaran'),
  (SELECT id FROM type_lookup WHERE slug = 'beachfront-villa'),
  1950000, 5, 5, 550, 800, 'available'::property_status, 'freehold'::property_ownership,
  '["Seafood Restaurants", "Sunset Views"]'::jsonb,
  '["海鲜餐厅", "日落景观"]'::jsonb,
  -8.7849, 115.1527, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Ubud Rice Terrace Villa', '乌布梯田别墅', 'prop-013',
  'Eco-friendly villa surrounded by UNESCO World Heritage rice terraces.',
  '被联合国教科文组织世界遗产稻田包围的生态友好别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'ubud'),
  (SELECT id FROM type_lookup WHERE slug = 'eco-villa'),
  1100000, 3, 3, 380, 600, 'available'::property_status, 'leasehold'::property_ownership,
  '["UNESCO Heritage", "Organic Garden"]'::jsonb,
  '["联合国遗产", "有机花园"]'::jsonb,
  -8.5069, 115.2625, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Pererenan Beach House', '佩雷雷南海滨屋', 'prop-014',
  'Contemporary beach house with panoramic ocean views and private pool.',
  '拥有全景海景和私人泳池的现代海滨别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'pererenan'),
  (SELECT id FROM type_lookup WHERE slug = 'beachfront-villa'),
  1650000, 4, 4, 450, 650, 'available'::property_status, 'leasehold'::property_ownership,
  '["Panoramic Views", "Private Pool"]'::jsonb,
  '["全景视野", "私人泳池"]'::jsonb,
  -8.6416, 115.1235, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Canggu Modern Retreat', '仓古现代度假屋', 'prop-015',
  'Sleek modern villa designed for the digital nomad lifestyle.',
  '为数字游牧生活方式设计的时尚现代别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'canggu'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1400000, 3, 3, 350, 500, 'available'::property_status, 'leasehold'::property_ownership,
  '["Digital Nomad", "Co-working Space"]'::jsonb,
  '["数字游牧", "共享办公"]'::jsonb,
  -8.6478, 115.1385, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Sanur Traditional Villa', '萨努尔传统别墅', 'prop-016',
  'Authentic Balinese villa with traditional architecture and modern comforts.',
  '具有传统建筑和现代舒适设施的正宗巴厘岛别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'sanur'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1250000, 4, 4, 420, 580, 'available'::property_status, 'leasehold'::property_ownership,
  '["Traditional Architecture", "Cultural Heritage"]'::jsonb,
  '["传统建筑", "文化遗产"]'::jsonb,
  -8.6807, 115.2633, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Echo Beach Surf Villa', '回声海滩冲浪别墅', 'prop-017',
  'Perfect surf villa with direct beach access and board storage.',
  '完美的冲浪别墅，可直接进入海滩并配有冲浪板存储。',
  (SELECT id FROM area_lookup WHERE slug = 'echo-beach'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1350000, 3, 3, 320, 450, 'available'::property_status, 'leasehold'::property_ownership,
  '["Surf Beach", "Board Storage"]'::jsonb,
  '["冲浪海滩", "冲浪板存储"]'::jsonb,
  -8.6478, 115.1385, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Bingin Cliff Villa', '宾金悬崖别墅', 'prop-018',
  'Spectacular clifftop villa with world-famous surf break views.',
  '壮观的悬崖顶别墅，可欣赏世界著名的冲浪点景色。',
  (SELECT id FROM area_lookup WHERE slug = 'bingin'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  2100000, 4, 4, 480, 700, 'available'::property_status, 'freehold'::property_ownership,
  '["Surf Break Views", "Clifftop Location"]'::jsonb,
  '["冲浪点景观", "悬崖位置"]'::jsonb,
  -8.8449, 115.0849, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Uluwatu Temple Villa', '乌鲁瓦图神庙别墅', 'prop-019',
  'Luxury villa near the famous Uluwatu Temple with cultural significance.',
  '靠近著名乌鲁瓦图神庙的豪华别墅，具有文化意义。',
  (SELECT id FROM area_lookup WHERE slug = 'uluwatu'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  2500000, 5, 5, 580, 850, 'available'::property_status, 'freehold'::property_ownership,
  '["Temple Views", "Cultural Site"]'::jsonb,
  '["神庙景观", "文化遗址"]'::jsonb,
  -8.8449, 115.0849, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Seminyak Beach Club Villa', '水明漾海滩俱乐部别墅', 'prop-020',
  'Exclusive villa with private beach club access and concierge services.',
  '独家别墅，享有私人海滩俱乐部通道和礼宾服务。',
  (SELECT id FROM area_lookup WHERE slug = 'seminyak'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  3200000, 6, 6, 700, 1000, 'available'::property_status, 'freehold'::property_ownership,
  '["Beach Club Access", "Concierge Service"]'::jsonb,
  '["海滩俱乐部", "礼宾服务"]'::jsonb,
  -8.6913, 115.1682, true;