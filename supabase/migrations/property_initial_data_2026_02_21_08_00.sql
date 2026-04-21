-- ========================================
-- 巴厘岛房产数据库初始数据插入
-- Bali Property Agency Initial Data
-- 插入时间: 2026-02-21 08:00 UTC
-- ========================================

-- ========================================
-- 1. 插入房产区域数据
-- ========================================
INSERT INTO public.property_areas_2026_02_21_08_00 (name_en, name_zh, slug, description_en, description_zh, is_featured, sort_order) VALUES
('Canggu', '仓古', 'canggu', 'Popular surfing destination with beach clubs and modern villas', '热门冲浪胜地，拥有海滩俱乐部和现代别墅', true, 1),
('Uluwatu', '乌鲁瓦图', 'uluwatu', 'Clifftop location with stunning ocean views and luxury resorts', '悬崖顶位置，拥有壮丽海景和豪华度假村', true, 2),
('Seminyak', '塞米亚克', 'seminyak', 'Upscale beach town known for high-end dining and shopping', '高档海滨小镇，以高端餐饮和购物闻名', true, 3),
('Ubud', '乌布', 'ubud', 'Cultural heart of Bali surrounded by rice terraces and jungle', '巴厘岛文化中心，被稻田和丛林环绕', true, 4),
('Sanur', '萨努尔', 'sanur', 'Quiet beach town perfect for families and relaxation', '安静的海滨小镇，适合家庭和休闲', false, 5),
('Jimbaran', '金巴兰', 'jimbaran', 'Famous for seafood restaurants and beautiful sunsets', '以海鲜餐厅和美丽日落闻名', false, 6),
('Nusa Dua', '努沙杜瓦', 'nusa-dua', 'Luxury resort area with pristine beaches and golf courses', '豪华度假区，拥有原始海滩和高尔夫球场', false, 7),
('Denpasar', '登巴萨', 'denpasar', 'Capital city with urban amenities and cultural attractions', '首都城市，拥有城市设施和文化景点', false, 8);

-- ========================================
-- 2. 插入房产类型数据
-- ========================================
INSERT INTO public.property_types_2026_02_21_08_00 (name_en, name_zh, slug, description_en, description_zh, icon, sort_order) VALUES
('Luxury Villa', '豪华别墅', 'luxury-villa', 'High-end private villas with premium amenities', '配备高端设施的豪华私人别墅', 'home', 1),
('Modern Villa', '现代别墅', 'modern-villa', 'Contemporary designed villas with modern features', '具有现代特色的当代设计别墅', 'building', 2),
('Traditional Villa', '传统别墅', 'traditional-villa', 'Authentic Balinese architecture and design', '正宗的巴厘岛建筑和设计', 'temple', 3),
('Beachfront Villa', '海滨别墅', 'beachfront-villa', 'Direct beach access with ocean views', '直接海滩通道，享有海景', 'waves', 4),
('Eco Villa', '生态别墅', 'eco-villa', 'Sustainable and environmentally friendly properties', '可持续和环保的房产', 'leaf', 5),
('Apartment', '公寓', 'apartment', 'Modern apartments in prime locations', '位于黄金地段的现代公寓', 'building-2', 6),
('Penthouse', '顶层公寓', 'penthouse', 'Luxury penthouse with panoramic views', '享有全景的豪华顶层公寓', 'crown', 7),
('Land Plot', '土地', 'land-plot', 'Development land for investment or building', '用于投资或建设的开发用地', 'map', 8);

-- ========================================
-- 3. 插入房产设施数据
-- ========================================
INSERT INTO public.property_amenities_2026_02_21_08_00 (name_en, name_zh, icon, category, sort_order) VALUES
-- 基础设施
('Swimming Pool', '游泳池', 'waves', 'recreation', 1),
('Private Garden', '私人花园', 'trees', 'recreation', 2),
('Parking Space', '停车位', 'car', 'utilities', 3),
('Air Conditioning', '空调', 'snowflake', 'utilities', 4),
('WiFi Internet', '无线网络', 'wifi', 'utilities', 5),
('Kitchen', '厨房', 'chef-hat', 'utilities', 6),

-- 安全设施
('24/7 Security', '24小时安保', 'shield', 'security', 7),
('CCTV System', '监控系统', 'camera', 'security', 8),
('Gated Community', '封闭社区', 'gate', 'security', 9),

-- 娱乐设施
('Gym/Fitness', '健身房', 'dumbbell', 'recreation', 10),
('Spa/Wellness', '水疗/养生', 'heart', 'recreation', 11),
('BBQ Area', '烧烤区', 'flame', 'recreation', 12),
('Entertainment Room', '娱乐室', 'gamepad-2', 'recreation', 13),
('Library/Study', '图书馆/书房', 'book', 'recreation', 14),

-- 高端设施
('Private Beach Access', '私人海滩通道', 'umbrella', 'recreation', 15),
('Infinity Pool', '无边泳池', 'waves', 'recreation', 16),
('Wine Cellar', '酒窖', 'wine', 'recreation', 17),
('Home Theater', '家庭影院', 'tv', 'recreation', 18),
('Rooftop Terrace', '屋顶露台', 'building', 'recreation', 19),
('Jacuzzi/Hot Tub', '按摩浴缸', 'bath', 'recreation', 20),

-- 服务设施
('Housekeeping Service', '清洁服务', 'broom', 'general', 21),
('Concierge Service', '礼宾服务', 'user-check', 'general', 22),
('Laundry Service', '洗衣服务', 'shirt', 'general', 23),
('Chef Service', '厨师服务', 'chef-hat', 'general', 24);

-- ========================================
-- 4. 插入示例房产数据
-- ========================================

-- 获取区域和类型的ID (使用子查询)
INSERT INTO public.properties_2026_02_21_08_00 (
    title_en, title_zh, slug, description_en, description_zh,
    area_id, type_id,
    price_usd, price_idr, price_cny, price_per_sqm_usd,
    bedrooms, bathrooms, building_area, land_area,
    status, ownership, land_type,
    tags_en, tags_zh,
    latitude, longitude, address_en, address_zh,
    is_featured, is_premium, is_new, is_published
) VALUES
-- 1. Canggu豪华别墅
(
    'Stunning Modern Villa in Canggu', '仓古绝美现代别墅', 'stunning-modern-villa-canggu',
    'A breathtaking 4-bedroom modern villa featuring contemporary design, private pool, and just 5 minutes walk to Echo Beach. Perfect for luxury living or investment.', 
    '令人惊叹的4卧室现代别墅，采用当代设计，配有私人泳池，步行5分钟即可到达Echo海滩。是豪华生活或投资的完美选择。',
    (SELECT id FROM public.property_areas_2026_02_21_08_00 WHERE slug = 'canggu'),
    (SELECT id FROM public.property_types_2026_02_21_08_00 WHERE slug = 'modern-villa'),
    850000, 13430000000, 6162500, 2833,
    4, 5, 300, 400,
    'available', 'leasehold', 'residential',
    '["靠海滩500米", "海景房", "私人沙滩", "冲浪"]'::jsonb,
    '["靠海滩500米", "海景房", "私人沙滩", "冲浪"]'::jsonb,
    -8.6481, 115.1372, 'Jl. Echo Beach, Canggu, Badung', '仓古Echo海滩路',
    true, true, true, true
),

-- 2. Uluwatu悬崖别墅
(
    'Clifftop Luxury Villa with Ocean Views', '乌鲁瓦图悬崖豪华海景别墅', 'clifftop-luxury-villa-uluwatu',
    'Spectacular 5-bedroom villa perched on Uluwatu cliffs with panoramic ocean views, infinity pool, and world-class amenities. A true masterpiece of luxury living.',
    '壮观的5卧室别墅坐落在乌鲁瓦图悬崖上，享有全景海景，配有无边泳池和世界级设施。真正的豪华生活杰作。',
    (SELECT id FROM public.property_areas_2026_02_21_08_00 WHERE slug = 'uluwatu'),
    (SELECT id FROM public.property_types_2026_02_21_08_00 WHERE slug = 'luxury-villa'),
    1250000, 19750000000, 9062500, 3125,
    5, 6, 400, 600,
    'available', 'freehold', 'residential',
    '["海景房", "自然风景房", "私人沙滩", "直升机停机坪"]'::jsonb,
    '["海景房", "自然风景房", "私人沙滩", "直升机停机坪"]'::jsonb,
    -8.8290, 115.0847, 'Jl. Uluwatu, Pecatu, Badung', '乌鲁瓦图路，佩卡图',
    true, true, false, true
),

-- 3. Seminyak现代公寓
(
    'Luxury Penthouse in Seminyak Center', '塞米亚克中心豪华顶层公寓', 'luxury-penthouse-seminyak',
    'Exquisite 3-bedroom penthouse in the heart of Seminyak with rooftop pool, modern amenities, and walking distance to beach clubs and restaurants.',
    '位于塞米亚克中心的精美3卧室顶层公寓，配有屋顶泳池、现代设施，步行即可到达海滩俱乐部和餐厅。',
    (SELECT id FROM public.property_areas_2026_02_21_08_00 WHERE slug = 'seminyak'),
    (SELECT id FROM public.property_types_2026_02_21_08_00 WHERE slug = 'penthouse'),
    650000, 10270000000, 4712500, 4333,
    3, 4, 150, 0,
    'available', 'leasehold', 'residential',
    '["靠海滩500米", "市中心", "高尔夫球场"]'::jsonb,
    '["靠海滩500米", "市中心", "高尔夫球场"]'::jsonb,
    -8.6917, 115.1611, 'Jl. Kayu Aya, Seminyak, Badung', '塞米亚克卡尤阿雅路',
    true, false, false, true
),

-- 4. Ubud生态别墅
(
    'Eco-Friendly Villa in Ubud Rice Fields', '乌布稻田生态别墅', 'eco-villa-ubud-rice-fields',
    'Sustainable 3-bedroom villa surrounded by lush rice terraces, featuring bamboo construction, solar power, and organic garden. Perfect retreat for nature lovers.',
    '可持续的3卧室别墅，被郁郁葱葱的稻田环绕，采用竹子建筑、太阳能发电和有机花园。自然爱好者的完美度假胜地。',
    (SELECT id FROM public.property_areas_2026_02_21_08_00 WHERE slug = 'ubud'),
    (SELECT id FROM public.property_types_2026_02_21_08_00 WHERE slug = 'eco-villa'),
    420000, 6636000000, 3045000, 1680,
    3, 3, 250, 500,
    'available', 'leasehold', 'residential',
    '["稻田景观", "生态建筑", "瑜伽空间", "私人花园"]'::jsonb,
    '["稻田景观", "生态建筑", "瑜伽空间", "私人花园"]'::jsonb,
    -8.5069, 115.2625, 'Jl. Raya Ubud, Ubud, Gianyar', '乌布拉雅路',
    false, false, true, true
),

-- 5. Sanur传统别墅
(
    'Traditional Balinese Villa in Sanur', '萨努尔传统巴厘岛别墅', 'traditional-villa-sanur',
    'Authentic 4-bedroom Balinese villa with traditional architecture, tropical garden, and peaceful location near Sanur beach. Rich cultural heritage.',
    '正宗的4卧室巴厘岛别墅，采用传统建筑，配有热带花园，位于萨努尔海滩附近的宁静位置。丰富的文化遗产。',
    (SELECT id FROM public.property_areas_2026_02_21_08_00 WHERE slug = 'sanur'),
    (SELECT id FROM public.property_types_2026_02_21_08_00 WHERE slug = 'traditional-villa'),
    380000, 6004000000, 2755000, 1520,
    4, 4, 250, 350,
    'available', 'leasehold', 'residential',
    '["靠海滩500米", "自然风景房", "私人花园", "温泉度假村"]'::jsonb,
    '["靠海滩500米", "自然风景房", "私人花园", "温泉度假村"]'::jsonb,
    -8.6872, 115.2619, 'Jl. Danau Tamblingan, Sanur, Denpasar', '萨努尔丹劳坦布林甘路',
    false, false, false, true
),

-- 6. Jimbaran海滨别墅
(
    'Beachfront Villa with Sunset Views', '金巴兰海滨日落别墅', 'beachfront-villa-jimbaran',
    'Magnificent 5-bedroom beachfront villa with direct beach access, stunning sunset views, and private dock. Ultimate luxury beachfront living.',
    '壮丽的5卧室海滨别墅，直接通往海滩，享有绝美日落景色和私人码头。终极豪华海滨生活。',
    (SELECT id FROM public.property_areas_2026_02_21_08_00 WHERE slug = 'jimbaran'),
    (SELECT id FROM public.property_types_2026_02_21_08_00 WHERE slug = 'beachfront-villa'),
    950000, 15010000000, 6887500, 2714,
    5, 5, 350, 500,
    'available', 'freehold', 'residential',
    '["海景房", "私人沙滩", "私人码头", "高尔夫球场"]'::jsonb,
    '["海景房", "私人沙滩", "私人码头", "高尔夫球场"]'::jsonb,
    -8.7892, 115.1619, 'Jl. Four Seasons, Jimbaran, Badung', '金巴兰四季路',
    true, true, false, true
);

-- ========================================
-- 5. 为示例房产添加设施关联
-- ========================================

-- Canggu现代别墅设施
INSERT INTO public.property_amenity_relations_2026_02_21_08_00 (property_id, amenity_id)
SELECT 
    p.id,
    a.id
FROM public.properties_2026_02_21_08_00 p,
     public.property_amenities_2026_02_21_08_00 a
WHERE p.slug = 'stunning-modern-villa-canggu'
AND a.name_en IN ('Swimming Pool', 'Private Garden', 'Parking Space', 'Air Conditioning', 'WiFi Internet', 'Kitchen', '24/7 Security', 'BBQ Area', 'Gym/Fitness');

-- Uluwatu豪华别墅设施
INSERT INTO public.property_amenity_relations_2026_02_21_08_00 (property_id, amenity_id)
SELECT 
    p.id,
    a.id
FROM public.properties_2026_02_21_08_00 p,
     public.property_amenities_2026_02_21_08_00 a
WHERE p.slug = 'clifftop-luxury-villa-uluwatu'
AND a.name_en IN ('Infinity Pool', 'Private Garden', 'Parking Space', 'Air Conditioning', 'WiFi Internet', 'Kitchen', '24/7 Security', 'CCTV System', 'Spa/Wellness', 'Wine Cellar', 'Home Theater', 'Rooftop Terrace', 'Concierge Service');

-- Seminyak顶层公寓设施
INSERT INTO public.property_amenity_relations_2026_02_21_08_00 (property_id, amenity_id)
SELECT 
    p.id,
    a.id
FROM public.properties_2026_02_21_08_00 p,
     public.property_amenities_2026_02_21_08_00 a
WHERE p.slug = 'luxury-penthouse-seminyak'
AND a.name_en IN ('Swimming Pool', 'Parking Space', 'Air Conditioning', 'WiFi Internet', 'Kitchen', '24/7 Security', 'Gated Community', 'Gym/Fitness', 'Rooftop Terrace');

-- Ubud生态别墅设施
INSERT INTO public.property_amenity_relations_2026_02_21_08_00 (property_id, amenity_id)
SELECT 
    p.id,
    a.id
FROM public.properties_2026_02_21_08_00 p,
     public.property_amenities_2026_02_21_08_00 a
WHERE p.slug = 'eco-villa-ubud-rice-fields'
AND a.name_en IN ('Private Garden', 'Parking Space', 'WiFi Internet', 'Kitchen', 'Library/Study', 'Spa/Wellness', 'BBQ Area');

-- Sanur传统别墅设施
INSERT INTO public.property_amenity_relations_2026_02_21_08_00 (property_id, amenity_id)
SELECT 
    p.id,
    a.id
FROM public.properties_2026_02_21_08_00 p,
     public.property_amenities_2026_02_21_08_00 a
WHERE p.slug = 'traditional-villa-sanur'
AND a.name_en IN ('Swimming Pool', 'Private Garden', 'Parking Space', 'Air Conditioning', 'WiFi Internet', 'Kitchen', 'BBQ Area', 'Spa/Wellness');

-- Jimbaran海滨别墅设施
INSERT INTO public.property_amenity_relations_2026_02_21_08_00 (property_id, amenity_id)
SELECT 
    p.id,
    a.id
FROM public.properties_2026_02_21_08_00 p,
     public.property_amenities_2026_02_21_08_00 a
WHERE p.slug = 'beachfront-villa-jimbaran'
AND a.name_en IN ('Infinity Pool', 'Private Beach Access', 'Private Garden', 'Parking Space', 'Air Conditioning', 'WiFi Internet', 'Kitchen', '24/7 Security', 'Jacuzzi/Hot Tub', 'BBQ Area', 'Concierge Service', 'Housekeeping Service');

-- ========================================
-- 6. 插入示例房产图片数据
-- ========================================

-- 为每个房产添加示例图片（使用占位符URL）
INSERT INTO public.property_images_2026_02_21_08_00 (property_id, image_url, thumbnail_url, alt_text_en, alt_text_zh, is_primary, sort_order, image_type) VALUES
-- Canggu现代别墅图片
((SELECT id FROM public.properties_2026_02_21_08_00 WHERE slug = 'stunning-modern-villa-canggu'), 
 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 
 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400', 
 'Modern villa exterior with pool', '现代别墅外观和泳池', true, 1, 'exterior'),

((SELECT id FROM public.properties_2026_02_21_08_00 WHERE slug = 'stunning-modern-villa-canggu'), 
 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 
 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', 
 'Spacious living room interior', '宽敞的客厅内部', false, 2, 'interior'),

-- Uluwatu豪华别墅图片
((SELECT id FROM public.properties_2026_02_21_08_00 WHERE slug = 'clifftop-luxury-villa-uluwatu'), 
 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 
 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', 
 'Clifftop villa with ocean views', '悬崖别墅海景', true, 1, 'exterior'),

-- Seminyak顶层公寓图片
((SELECT id FROM public.properties_2026_02_21_08_00 WHERE slug = 'luxury-penthouse-seminyak'), 
 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 
 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', 
 'Modern penthouse with city views', '现代顶层公寓城市景观', true, 1, 'exterior'),

-- Ubud生态别墅图片
((SELECT id FROM public.properties_2026_02_21_08_00 WHERE slug = 'eco-villa-ubud-rice-fields'), 
 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', 
 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', 
 'Eco villa surrounded by rice fields', '被稻田环绕的生态别墅', true, 1, 'view'),

-- Sanur传统别墅图片
((SELECT id FROM public.properties_2026_02_21_08_00 WHERE slug = 'traditional-villa-sanur'), 
 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800', 
 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400', 
 'Traditional Balinese architecture', '传统巴厘岛建筑', true, 1, 'exterior'),

-- Jimbaran海滨别墅图片
((SELECT id FROM public.properties_2026_02_21_08_00 WHERE slug = 'beachfront-villa-jimbaran'), 
 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 
 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', 
 'Beachfront villa with sunset views', '海滨别墅日落景观', true, 1, 'view');

-- ========================================
-- 初始数据插入完成
-- ========================================

-- 显示插入的数据统计
SELECT 
    'Property Areas' as table_name, 
    COUNT(*) as record_count 
FROM public.property_areas_2026_02_21_08_00
UNION ALL
SELECT 
    'Property Types' as table_name, 
    COUNT(*) as record_count 
FROM public.property_types_2026_02_21_08_00
UNION ALL
SELECT 
    'Property Amenities' as table_name, 
    COUNT(*) as record_count 
FROM public.property_amenities_2026_02_21_08_00
UNION ALL
SELECT 
    'Properties' as table_name, 
    COUNT(*) as record_count 
FROM public.properties_2026_02_21_08_00
UNION ALL
SELECT 
    'Property Images' as table_name, 
    COUNT(*) as record_count 
FROM public.property_images_2026_02_21_08_00
UNION ALL
SELECT 
    'Property Amenity Relations' as table_name, 
    COUNT(*) as record_count 
FROM public.property_amenity_relations_2026_02_21_08_00;