-- 批量导入房产数据（第3批：prop-021到prop-030）
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
  'Jungle Harmony Villa', '丛林和谐别墅', 'prop-021',
  'Sustainable eco-villa nestled in Ubud''s pristine jungle environment.',
  '坐落在乌布原始丛林环境中的可持续生态别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'ubud'),
  (SELECT id FROM type_lookup WHERE slug = 'eco-villa'),
  950000, 3, 3, 300, 500, 'available'::property_status, 'leasehold'::property_ownership,
  '["Jungle Setting", "Sustainable Design"]'::jsonb,
  '["丛林环境", "可持续设计"]'::jsonb,
  -8.5069, 115.2625, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Canggu Artist Loft', '仓古艺术阁楼', 'prop-022',
  'Creative loft space perfect for artists and creative professionals.',
  '完美适合艺术家和创意专业人士的创意阁楼空间。',
  (SELECT id FROM area_lookup WHERE slug = 'canggu'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1150000, 2, 2, 250, 350, 'available'::property_status, 'leasehold'::property_ownership,
  '["Artist Studio", "Creative Space"]'::jsonb,
  '["艺术工作室", "创意空间"]'::jsonb,
  -8.6478, 115.1385, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Pererenan Wellness Retreat', '佩雷雷南健康度假村', 'prop-023',
  'Holistic wellness villa with yoga pavilion and meditation gardens.',
  '配有瑜伽亭和冥想花园的整体健康别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'pererenan'),
  (SELECT id FROM type_lookup WHERE slug = 'eco-villa'),
  1300000, 4, 4, 400, 600, 'available'::property_status, 'leasehold'::property_ownership,
  '["Yoga Pavilion", "Meditation Garden"]'::jsonb,
  '["瑜伽亭", "冥想花园"]'::jsonb,
  -8.6416, 115.1235, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Sanur Heritage Villa', '萨努尔遗产别墅', 'prop-024',
  'Restored traditional Balinese compound with historical significance.',
  '具有历史意义的修复传统巴厘岛建筑群。',
  (SELECT id FROM area_lookup WHERE slug = 'sanur'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  1750000, 5, 5, 600, 900, 'available'::property_status, 'freehold'::property_ownership,
  '["Historical Significance", "Traditional Compound"]'::jsonb,
  '["历史意义", "传统建筑群"]'::jsonb,
  -8.6807, 115.2633, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Jimbaran Sunset Villa', '金巴兰日落别墅', 'prop-025',
  'Romantic villa with unobstructed sunset views over Jimbaran Bay.',
  '浪漫别墅，可欣赏金巴兰海湾无遮挡的日落景色。',
  (SELECT id FROM area_lookup WHERE slug = 'jimbaran'),
  (SELECT id FROM type_lookup WHERE slug = 'honeymoon-villa'),
  1600000, 3, 3, 350, 500, 'available'::property_status, 'leasehold'::property_ownership,
  '["Sunset Views", "Romantic Setting"]'::jsonb,
  '["日落景观", "浪漫环境"]'::jsonb,
  -8.7849, 115.1527, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Seminyak Business Hub', '水明漾商务中心', 'prop-026',
  'Modern business villa with conference facilities and high-speed internet.',
  '配有会议设施和高速互联网的现代商务别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'seminyak'),
  (SELECT id FROM type_lookup WHERE slug = 'business-villa'),
  2100000, 5, 5, 550, 750, 'available'::property_status, 'leasehold'::property_ownership,
  '["Conference Facilities", "High-speed Internet"]'::jsonb,
  '["会议设施", "高速网络"]'::jsonb,
  -8.6913, 115.1682, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Uluwatu Infinity Villa', '乌鲁瓦图无限别墅', 'prop-027',
  'Architectural masterpiece with infinity pool overlooking the Indian Ocean.',
  '建筑杰作，配有俯瞰印度洋的无边际泳池。',
  (SELECT id FROM area_lookup WHERE slug = 'uluwatu'),
  (SELECT id FROM type_lookup WHERE slug = 'luxury-villa'),
  3800000, 6, 7, 800, 1200, 'available'::property_status, 'freehold'::property_ownership,
  '["Infinity Pool", "Ocean Views", "Architectural Design"]'::jsonb,
  '["无边际泳池", "海景", "建筑设计"]'::jsonb,
  -8.8449, 115.0849, true

UNION ALL SELECT 
  gen_random_uuid(),
  'Echo Beach Music Villa', '回声海滩音乐别墅', 'prop-028',
  'State-of-the-art recording studio villa for music professionals.',
  '为音乐专业人士打造的最先进录音室别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'echo-beach'),
  (SELECT id FROM type_lookup WHERE slug = 'music-villa'),
  1850000, 4, 4, 500, 700, 'available'::property_status, 'leasehold'::property_ownership,
  '["Recording Studio", "Sound Proof"]'::jsonb,
  '["录音室", "隔音"]'::jsonb,
  -8.6478, 115.1385, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Bingin Secret Villa', '宾金秘密别墅', 'prop-029',
  'Ultra-private villa hidden among tropical gardens with exclusive beach access.',
  '隐藏在热带花园中的超私密别墅，享有独家海滩通道。',
  (SELECT id FROM area_lookup WHERE slug = 'bingin'),
  (SELECT id FROM type_lookup WHERE slug = 'private-villa'),
  2800000, 5, 5, 600, 1000, 'available'::property_status, 'freehold'::property_ownership,
  '["Ultra Private", "Exclusive Beach Access"]'::jsonb,
  '["超私密", "独家海滩通道"]'::jsonb,
  -8.8449, 115.0849, false

UNION ALL SELECT 
  gen_random_uuid(),
  'Canggu Co-living Space', '仓古共享生活空间', 'prop-030',
  'Modern co-living villa designed for digital nomads and remote workers.',
  '为数字游牧者和远程工作者设计的现代共享生活别墅。',
  (SELECT id FROM area_lookup WHERE slug = 'canggu'),
  (SELECT id FROM type_lookup WHERE slug = 'co-living-villa'),
  1200000, 8, 8, 600, 800, 'available'::property_status, 'leasehold'::property_ownership,
  '["Co-living", "Digital Nomad", "Shared Facilities"]'::jsonb,
  '["共享生活", "数字游牧", "共享设施"]'::jsonb,
  -8.6478, 115.1385, false;