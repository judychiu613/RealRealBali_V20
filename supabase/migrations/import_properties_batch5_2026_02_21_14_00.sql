-- 批量导入房产数据（第5批：prop-041到prop-050）
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
  'Seminyak Penthouse', '水明漾顶层公寓', 'prop-041',
  'Luxury penthouse with rooftop terrace and panoramic views.',
  '豪华顶层公寓，配有屋顶露台和全景视野。',
  (SELECT id FROM area_lookup WHERE slug = 'seminyak'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  2600000, 4, 4, 500, 600, 'available'::property_status, 'freehold'::property_ownership,
  '["Rooftop Terrace", "Panoramic Views"]'::jsonb,
  '["屋顶露台", "全景视野"]'::jsonb,
  -8.6913, 115.1682, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Canggu Surf Camp', '仓古冲浪营地', 'prop-042',
  'Multi-bedroom surf camp villa perfect for group retreats.',
  '多卧室冲浪营地别墅，非常适合团体度假。',
  (SELECT id FROM area_lookup WHERE slug = 'canggu'),
  (SELECT id FROM type_lookup WHERE slug = 'co-living-villa'),
  1600000, 6, 6, 500, 800, 'available'::property_status, 'leasehold'::property_ownership,
  '["Surf Camp", "Group Retreats"]'::jsonb,
  '["冲浪营地", "团体度假"]'::jsonb,
  -8.6478, 115.1385, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Jimbaran Luxury Resort', '金巴兰豪华度假村', 'prop-043',
  'Resort-style villa with multiple pools and spa facilities.',
  '度假村风格别墅，配有多个泳池和水疗设施。',
  (SELECT id FROM area_lookup WHERE slug = 'jimbaran'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  3500000, 8, 8, 1000, 1800, 'available'::property_status, 'freehold'::property_ownership,
  '["Multiple Pools", "Spa Facilities"]'::jsonb,
  '["多个泳池", "水疗设施"]'::jsonb,
  -8.7849, 115.1527, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Ubud Treehouse Villa', '乌布树屋别墅', 'prop-044',
  'Unique treehouse villa elevated among the jungle canopy.',
  '独特的树屋别墅，高耸在丛林树冠之间。',
  (SELECT id FROM area_lookup WHERE slug = 'ubud'),
  (SELECT id FROM type_lookup WHERE slug = 'eco-villa'),
  1100000, 2, 2, 200, 300, 'available'::property_status, 'leasehold'::property_ownership,
  '["Treehouse", "Jungle Canopy"]'::jsonb,
  '["树屋", "丛林树冠"]'::jsonb,
  -8.5069, 115.2625, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Pererenan Yoga Retreat', '佩雷雷南瑜伽度假村', 'prop-045',
  'Dedicated yoga retreat with multiple studios and wellness facilities.',
  '专门的瑜伽度假村，配有多个工作室和健康设施。',
  (SELECT id FROM area_lookup WHERE slug = 'pererenan'),
  (SELECT id FROM type_lookup WHERE slug = 'eco-villa'),
  1450000, 4, 4, 400, 700, 'available'::property_status, 'leasehold'::property_ownership,
  '["Yoga Studios", "Wellness Facilities"]'::jsonb,
  '["瑜伽工作室", "健康设施"]'::jsonb,
  -8.6416, 115.1235, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Sanur Boutique Villa', '萨努尔精品别墅', 'prop-046',
  'Intimate boutique villa with personalized service and unique design.',
  '私密精品别墅，提供个性化服务和独特设计。',
  (SELECT id FROM area_lookup WHERE slug = 'sanur'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1750000, 3, 3, 350, 500, 'available'::property_status, 'leasehold'::property_ownership,
  '["Boutique Design", "Personalized Service"]'::jsonb,
  '["精品设计", "个性化服务"]'::jsonb,
  -8.6807, 115.2633, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Uluwatu Glass House', '乌鲁瓦图玻璃屋', 'prop-047',
  'Modern glass house with floor-to-ceiling windows and ocean views.',
  '现代玻璃屋，配有落地窗和海景。',
  (SELECT id FROM area_lookup WHERE slug = 'uluwatu'),
  (SELECT id FROM type_lookup WHERE slug = 'futuristic-villa'),
  3200000, 4, 4, 450, 600, 'available'::property_status, 'freehold'::property_ownership,
  '["Glass House", "Floor-to-ceiling Windows"]'::jsonb,
  '["玻璃屋", "落地窗"]'::jsonb,
  -8.8449, 115.0849, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Echo Beach Artist Studio', '回声海滩艺术工作室', 'prop-048',
  'Creative studio villa with art galleries and workshop spaces.',
  '创意工作室别墅，配有艺术画廊和工作坊空间。',
  (SELECT id FROM area_lookup WHERE slug = 'echo-beach'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1550000, 3, 3, 400, 550, 'available'::property_status, 'leasehold'::property_ownership,
  '["Art Galleries", "Workshop Spaces"]'::jsonb,
  '["艺术画廊", "工作坊空间"]'::jsonb,
  -8.6478, 115.1385, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Bingin Cliff Mansion', '宾金悬崖豪宅', 'prop-049',
  'Grand cliff mansion with multiple levels and breathtaking views.',
  '宏伟的悬崖豪宅，多层设计，景色令人叹为观止。',
  (SELECT id FROM area_lookup WHERE slug = 'bingin'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  4200000, 7, 8, 900, 1500, 'available'::property_status, 'freehold'::property_ownership,
  '["Cliff Mansion", "Multiple Levels", "Breathtaking Views"]'::jsonb,
  '["悬崖豪宅", "多层设计", "壮观景色"]'::jsonb,
  -8.8449, 115.0849, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Seminyak Sky Villa', '水明漾天空别墅', 'prop-050',
  'Ultra-modern sky villa with helicopter pad and luxury amenities.',
  '超现代天空别墅，配有直升机停机坪和豪华设施。',
  (SELECT id FROM area_lookup WHERE slug = 'seminyak'),
  (SELECT id FROM type_lookup WHERE slug = 'futuristic-villa'),
  5500000, 8, 10, 1500, 2500, 'available'::property_status, 'freehold'::property_ownership,
  '["Helicopter Pad", "Ultra Modern", "Luxury Amenities"]'::jsonb,
  '["直升机停机坪", "超现代", "豪华设施"]'::jsonb,
  -8.6913, 115.1682, true;