-- 使用现有正确ID插入土地数据

-- 插入更多土地房源数据（使用现有的正确外键ID）
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
-- 土地1：仓古海滨土地
('land-001', 
 'Canggu Beachfront Land', '仓古海滨土地',
 'Prime beachfront land in Canggu with stunning ocean views. Perfect for luxury villa development or commercial resort project. Direct beach access with 50 meters of beach frontage.',
 '仓古黄金海滨土地，拥有绝美海景。适合豪华别墅开发或商业度假村项目。直接海滩通道，50米海滩面宽。',
 2500, 18000, 37500000,
 0, 0, 0, 2500,
 'canggu', 'land', 'available', 'leasehold',
 -8.6482, 115.1342,
 ARRAY['beachfront', 'investment', 'development', 'ocean view'], 
 ARRAY['海滨', '投资', '开发', '海景'],
 ARRAY['beach access', 'utilities ready', 'road access', 'clear title'],
 ARRAY['海滩通道', '基础设施齐全', '道路通达', '产权清晰'],
 true, true, null, 'lz-001', 25,
 now(), now()),

-- 土地2：乌布梯田土地
('land-002',
 'Ubud Rice Terrace Land', '乌布梯田土地', 
 'Spectacular rice terrace land in central Ubud with panoramic valley views. Ideal for eco-resort or luxury retreat development. Surrounded by traditional Balinese villages.',
 '乌布中心壮观梯田土地，拥有全景山谷视野。适合生态度假村或豪华静修中心开发。被传统巴厘村庄环绕。',
 1800, 13000, 27000000,
 0, 0, 0, 1800,
 'ubud', 'land', 'available', 'leasehold',
 -8.5069, 115.2624,
 ARRAY['rice terrace', 'valley view', 'eco-friendly', 'cultural'],
 ARRAY['梯田', '山谷景观', '生态友好', '文化'],
 ARRAY['mountain view', 'spring water', 'organic farming', 'village access'],
 ARRAY['山景', '泉水', '有机农业', '村庄通道'],
 true, true, null, 'lz-003', 30,
 now(), now()),

-- 土地3：乌鲁瓦图悬崖土地
('land-003',
 'Uluwatu Clifftop Land', '乌鲁瓦图悬崖土地',
 'Exclusive clifftop land in Uluwatu with breathtaking Indian Ocean views. Premium location for luxury villa or boutique hotel development. Sunset views guaranteed.',
 '乌鲁瓦图独家悬崖土地，拥有令人惊叹的印度洋景观。豪华别墅或精品酒店开发的优质地段。保证日落美景。',
 3200, 23000, 48000000,
 0, 0, 0, 1200,
 'uluwatu', 'land', 'available', 'freehold',
 -8.8290, 115.0844,
 ARRAY['clifftop', 'ocean view', 'sunset', 'premium'],
 ARRAY['悬崖', '海景', '日落', '优质'],
 ARRAY['cliff access', 'panoramic view', 'privacy', 'luxury location'],
 ARRAY['悬崖通道', '全景视野', '私密性', '豪华地段'],
 true, true, null, 'lz-001', null,
 now(), now()),

-- 土地4：萨努尔商业土地
('land-004',
 'Sanur Commercial Land', '萨努尔商业土地',
 'Strategic commercial land in Sanur main road with high visibility and traffic. Perfect for retail, restaurant, or mixed-use development. Close to beach and airport.',
 '萨努尔主干道战略商业土地，高能见度和车流量。适合零售、餐厅或混合用途开发。靠近海滩和机场。',
 2800, 20000, 42000000,
 0, 0, 0, 800,
 'sanur', 'commercial', 'available', 'freehold',
 -8.6872, 115.2620,
 ARRAY['commercial', 'main road', 'high traffic', 'strategic'],
 ARRAY['商业', '主干道', '高流量', '战略'],
 ARRAY['road frontage', 'utilities', 'zoning permit', 'investment'],
 ARRAY['临街', '基础设施', '规划许可', '投资'],
 false, true, null, 'lz-004', null,
 now(), now()),

-- 土地5：金巴兰山坡土地
('land-005',
 'Jimbaran Hillside Land', '金巴兰山坡土地',
 'Elevated hillside land in Jimbaran with panoramic bay views. Gentle slope perfect for terraced villa development. Close to luxury resorts and beach clubs.',
 '金巴兰高地山坡土地，拥有全景海湾视野。缓坡地形适合梯田式别墅开发。靠近豪华度假村和海滩俱乐部。',
 2200, 16000, 33000000,
 0, 0, 0, 1500,
 'jimbaran', 'land', 'available', 'leasehold',
 -8.7983, 115.1603,
 ARRAY['hillside', 'bay view', 'elevated', 'luxury area'],
 ARRAY['山坡', '海湾景观', '高地', '豪华区域'],
 ARRAY['panoramic view', 'gentle slope', 'resort area', 'beach access'],
 ARRAY['全景视野', '缓坡', '度假区', '海滩通道'],
 false, true, null, 'lz-002', 25,
 now(), now()),

-- 土地6：登巴萨工业土地
('land-006',
 'Denpasar Industrial Land', '登巴萨工业土地',
 'Large industrial land in Denpasar with excellent logistics access. Suitable for warehouse, manufacturing, or distribution center. Close to port and airport.',
 '登巴萨大型工业土地，物流通达性极佳。适合仓储、制造或配送中心。靠近港口和机场。',
 1200, 8500, 18000000,
 0, 0, 0, 5000,
 'denpasar', 'commercial', 'available', 'freehold',
 -8.6705, 115.2126,
 ARRAY['industrial', 'logistics', 'large scale', 'infrastructure'],
 ARRAY['工业', '物流', '大规模', '基础设施'],
 ARRAY['truck access', 'utilities', 'zoning', 'expansion potential'],
 ARRAY['货车通道', '基础设施', '规划', '扩展潜力'],
 false, true, null, 'lz-005', null,
 now(), now());

-- 验证插入的土地数据，计算单价/are
SELECT 
    id, title_zh, type_id, land_area, 
    price_usd,
    ROUND(price_usd::numeric / (land_area::numeric / 100), 0) as price_per_are_usd,
    ROUND(price_cny::numeric / (land_area::numeric / 100), 0) as price_per_are_cny,
    ROUND(price_idr::numeric / (land_area::numeric / 100), 0) as price_per_are_idr,
    area_id, land_zone_id
FROM public.properties 
WHERE type_id IN ('land', 'commercial')
ORDER BY created_at DESC;