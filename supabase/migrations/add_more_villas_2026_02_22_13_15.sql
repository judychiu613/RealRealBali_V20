-- 添加更多别墅数据

-- 插入更多别墅房源数据
INSERT INTO public.properties (
    id, title_en, title_zh, description_en, description_zh,
    price_usd, price_cny, price_idr,
    bedrooms, bathrooms, building_area, land_area,
    area_id, type_id, status, ownership,
    latitude, longitude,
    tags_en, tags_zh, amenities_en, amenities_zh,
    is_featured, is_published, build_year, land_zone_id, leasehold_years,
    created_at, updated_at
) VALUES 
-- 别墅7：乌布森林别墅
('villa-007', 
 'Ubud Forest Villa', '乌布森林别墅',
 'Secluded forest villa in Ubud surrounded by tropical rainforest. Features infinity pool, yoga pavilion, and organic garden. Perfect retreat for nature lovers.',
 '乌布隐秘森林别墅，被热带雨林环绕。配有无边泳池、瑜伽亭和有机花园。自然爱好者的完美静修之地。',
 850000, 6100000, 12750000000,
 4, 4, 320, 1200,
 'ubud', 'villa', 'available', 'leasehold',
 -8.5069, 115.2624,
 ARRAY['forest', 'secluded', 'yoga', 'organic'],
 ARRAY['森林', '隐秘', '瑜伽', '有机'],
 ARRAY['infinity pool', 'yoga pavilion', 'organic garden', 'rainforest view'],
 ARRAY['无边泳池', '瑜伽亭', '有机花园', '雨林景观'],
 true, true, 2023, 'greenzone', 25,
 now(), now()),

-- 别墅8：萨努尔海滨别墅
('villa-008',
 'Sanur Beachfront Villa', '萨努尔海滨别墅', 
 'Elegant beachfront villa in Sanur with direct beach access. Traditional Balinese architecture meets modern luxury. Perfect for family holidays.',
 '萨努尔优雅海滨别墅，直接海滩通道。传统巴厘建筑与现代奢华的完美结合。家庭度假的理想选择。',
 1200000, 8600000, 18000000000,
 5, 5, 450, 800,
 'sanur', 'villa', 'available', 'freehold',
 -8.6872, 115.2620,
 ARRAY['beachfront', 'traditional', 'family', 'luxury'],
 ARRAY['海滨', '传统', '家庭', '奢华'],
 ARRAY['beach access', 'traditional design', 'family pool', 'garden'],
 ARRAY['海滩通道', '传统设计', '家庭泳池', '花园'],
 false, true, 2022, 'bluezone', null,
 now(), now()),

-- 别墅9：金巴兰山景别墅
('villa-009',
 'Jimbaran Hill Villa', '金巴兰山景别墅',
 'Stunning hill villa in Jimbaran with panoramic ocean and sunset views. Modern minimalist design with infinity pool and outdoor entertainment area.',
 '金巴兰壮观山景别墅，拥有全景海洋和日落景观。现代极简设计，配有无边泳池和户外娱乐区。',
 950000, 6800000, 14250000000,
 4, 4, 380, 1000,
 'jimbaran', 'villa', 'available', 'leasehold',
 -8.7983, 115.1603,
 ARRAY['hill', 'sunset', 'modern', 'panoramic'],
 ARRAY['山景', '日落', '现代', '全景'],
 ARRAY['infinity pool', 'sunset view', 'entertainment area', 'modern design'],
 ARRAY['无边泳池', '日落景观', '娱乐区', '现代设计'],
 true, true, 2024, 'yellowzone', 30,
 now(), now()),

-- 别墅10：登巴萨市区别墅
('villa-010',
 'Denpasar City Villa', '登巴萨市区别墅',
 'Contemporary city villa in Denpasar with easy access to shopping and dining. Perfect for business travelers and urban lifestyle enthusiasts.',
 '登巴萨现代市区别墅，便于购物和用餐。商务旅行者和都市生活爱好者的完美选择。',
 680000, 4900000, 10200000000,
 3, 3, 280, 600,
 'denpasar', 'villa', 'available', 'freehold',
 -8.6705, 115.2126,
 ARRAY['city', 'contemporary', 'convenient', 'business'],
 ARRAY['市区', '现代', '便利', '商务'],
 ARRAY['city access', 'modern amenities', 'parking', 'security'],
 ARRAY['市区通道', '现代设施', '停车场', '安保'],
 false, true, 2023, 'whitezone', null,
 now(), now());

-- 验证插入的别墅数据
SELECT 
    COUNT(*) as total_villas_after_insert
FROM public.properties 
WHERE type_id = 'villa';

-- 查看新插入的别墅
SELECT 
    id, title_zh, bedrooms, bathrooms, price_usd, area_id
FROM public.properties 
WHERE id LIKE 'villa-0%'
ORDER BY id;