-- 批量导入房产数据（第4批：prop-031到prop-040）
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
  'Ubud Retirement Haven', '乌布退休天堂', 'prop-031',
  'Peaceful retirement villa with accessible design and healthcare facilities.',
  '宁静的退休别墅，配有无障碍设计和医疗保健设施。',
  (SELECT id FROM area_lookup WHERE slug = 'ubud'),
  (SELECT id FROM type_lookup WHERE slug = 'retirement-villa'),
  1400000, 3, 3, 350, 600, 'available'::property_status, 'freehold'::property_ownership,
  '["Accessible Design", "Healthcare Facilities"]'::jsonb,
  '["无障碍设计", "医疗设施"]'::jsonb,
  -8.5069, 115.2625, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Pererenan Family Compound', '佩雷雷南家庭大院', 'prop-032',
  'Spacious family villa with multiple bedrooms and child-friendly amenities.',
  '宽敞的家庭别墅，配有多间卧室和儿童友好设施。',
  (SELECT id FROM area_lookup WHERE slug = 'pererenan'),
  (SELECT id FROM type_lookup WHERE slug = 'family-villa'),
  1800000, 5, 5, 500, 1000, 'available'::property_status, 'leasehold'::property_ownership,
  '["Family Friendly", "Multiple Bedrooms"]'::jsonb,
  '["家庭友好", "多间卧室"]'::jsonb,
  -8.6416, 115.1235, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Sanur Pet Paradise', '萨努尔宠物天堂', 'prop-033',
  'Pet-friendly villa with secure gardens and pet care facilities.',
  '宠物友好别墅，配有安全花园和宠物护理设施。',
  (SELECT id FROM area_lookup WHERE slug = 'sanur'),
  (SELECT id FROM type_lookup WHERE slug = 'pet-villa'),
  1300000, 3, 3, 300, 800, 'available'::property_status, 'leasehold'::property_ownership,
  '["Pet Friendly", "Secure Gardens"]'::jsonb,
  '["宠物友好", "安全花园"]'::jsonb,
  -8.6807, 115.2633, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Canggu Sports Villa', '仓古运动别墅', 'prop-034',
  'Athletic villa with gym, tennis court, and sports facilities.',
  '运动别墅，配有健身房、网球场和运动设施。',
  (SELECT id FROM area_lookup WHERE slug = 'canggu'),
  (SELECT id FROM type_lookup WHERE slug = 'sports-base'),
  2200000, 4, 4, 450, 700, 'available'::property_status, 'leasehold'::property_ownership,
  '["Gym", "Tennis Court", "Sports Facilities"]'::jsonb,
  '["健身房", "网球场", "运动设施"]'::jsonb,
  -8.6478, 115.1385, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Seminyak Culinary Estate', '水明漾美食庄园', 'prop-035',
  'Gourmet villa with professional kitchen and wine cellar for food enthusiasts.',
  '为美食爱好者打造的美食别墅，配有专业厨房和酒窖。',
  (SELECT id FROM area_lookup WHERE slug = 'seminyak'),
  (SELECT id FROM type_lookup WHERE slug = 'culinary-estate'),
  2800000, 6, 6, 800, 1500, 'available'::property_status, 'freehold'::property_ownership,
  '["Professional Kitchen", "Wine Cellar"]'::jsonb,
  '["专业厨房", "酒窖"]'::jsonb,
  -8.6913, 115.1682, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Uluwatu Future Villa', '乌鲁瓦图未来别墅', 'prop-036',
  'Cutting-edge smart villa with AI integration and sustainable technology.',
  '尖端智能别墅，集成人工智能和可持续技术。',
  (SELECT id FROM area_lookup WHERE slug = 'uluwatu'),
  (SELECT id FROM type_lookup WHERE slug = 'futuristic-villa'),
  4500000, 7, 9, 1200, 2000, 'available'::property_status, 'freehold'::property_ownership,
  '["AI Integration", "Sustainable Technology"]'::jsonb,
  '["人工智能", "可持续技术"]'::jsonb,
  -8.8449, 115.0849, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Jimbaran Beach Villa', '金巴兰海滩别墅', 'prop-037',
  'Elegant beachfront villa with direct access to pristine white sand beach.',
  '优雅的海滨别墅，可直接进入原始白沙滩。',
  (SELECT id FROM area_lookup WHERE slug = 'jimbaran'),
  (SELECT id FROM type_lookup WHERE slug = 'beachfront-villa'),
  2400000, 5, 5, 600, 900, 'available'::property_status, 'freehold'::property_ownership,
  '["White Sand Beach", "Direct Access"]'::jsonb,
  '["白沙滩", "直接通道"]'::jsonb,
  -8.7849, 115.1527, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Echo Beach Minimalist', '回声海滩极简主义', 'prop-038',
  'Ultra-minimalist villa with clean lines and zen-inspired design.',
  '超极简主义别墅，线条简洁，设计灵感来自禅宗。',
  (SELECT id FROM area_lookup WHERE slug = 'echo-beach'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1650000, 3, 3, 320, 450, 'available'::property_status, 'leasehold'::property_ownership,
  '["Minimalist Design", "Zen Inspired"]'::jsonb,
  '["极简设计", "禅宗灵感"]'::jsonb,
  -8.6478, 115.1385, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Bingin Honeymoon Suite', '宾金蜜月套房', 'prop-039',
  'Intimate honeymoon villa with private pool and romantic amenities.',
  '私密蜜月别墅，配有私人泳池和浪漫设施。',
  (SELECT id FROM area_lookup WHERE slug = 'bingin'),
  (SELECT id FROM type_lookup WHERE slug = 'honeymoon-villa'),
  1900000, 2, 2, 300, 400, 'available'::property_status, 'leasehold'::property_ownership,
  '["Private Pool", "Romantic Amenities"]'::jsonb,
  '["私人泳池", "浪漫设施"]'::jsonb,
  -8.8449, 115.0849, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Ubud Meditation Retreat', '乌布冥想度假村', 'prop-040',
  'Spiritual retreat villa with meditation halls and healing gardens.',
  '精神度假别墅，配有冥想厅和疗愈花园。',
  (SELECT id FROM area_lookup WHERE slug = 'ubud'),
  (SELECT id FROM type_lookup WHERE slug = 'eco-villa'),
  1250000, 4, 4, 400, 700, 'available'::property_status, 'leasehold'::property_ownership,
  '["Meditation Halls", "Healing Gardens"]'::jsonb,
  '["冥想厅", "疗愈花园"]'::jsonb,
  -8.5069, 115.2625, false;