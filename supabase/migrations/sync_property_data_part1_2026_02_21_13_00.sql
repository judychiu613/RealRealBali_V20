-- 清空现有房产数据
TRUNCATE TABLE public.properties_2026_02_21_08_00 CASCADE;

-- 插入完整的房产数据（前端数据同步）
INSERT INTO public.properties_2026_02_21_08_00 (
  id, title_zh, title_en, price_usd, location_zh, location_en, type_zh, type_en,
  bedrooms, bathrooms, land_area_sqm, building_area_sqm, main_image_url, 
  additional_images, status, ownership_type, leasehold_years, land_zone_type,
  description_zh, description_en, is_featured, tags, latitude, longitude
) VALUES 
-- prop-001: 玄武岩之境
('prop-001', '玄武岩之境', 'The Basalt Sanctuary', 1280000, '回声海滩', 'Echo Beach', '豪华别墅', 'Luxury Villa',
 4, 4, 600, 420, 'https://images.unsplash.com/photo-1703135387362-4b749023e1e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBiZWFjaGZyb250JTIwdmlsbGElMjBvY2VhbiUyMHZpZXclMjBzdW5zZXR8ZW58MHwwfHxibHVlfDE3NzA4OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
 ARRAY['https://images.unsplash.com/photo-1703135387362-4b749023e1e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBiZWFjaGZyb250JTIwdmlsbGElMjBvY2VhbiUyMHZpZXclMjBzdW5zZXR8ZW58MHwwfHxibHVlfDE3NzA4OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1585216658790-094546fa88e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw0fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1567491634123-460945ea86dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw5fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1711948728889-614d5d0030f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw4fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
 'available', 'leasehold', 25, 'yellow_zone',
 '这座位于仓古核心区域的静奢杰作，完美融合了都会极简主义与巴厘岛的热带美学。开放式生活空间与无边界泳池无缝衔接。',
 'A quiet luxury masterpiece in the heart of Canggu, blending urban minimalism with tropical aesthetics.',
 true, ARRAY['靠海滩500米', '自然风景房'], -8.6478, 115.1385),

-- prop-002: 蔚蓝地平线
('prop-002', '蔚蓝地平线', 'Horizon Azure', 3500000, '宾金', 'Bingin', '海滨别墅', 'Beachfront Villa',
 5, 6, 1200, 850, 'https://images.unsplash.com/photo-1760564019062-7e7efdf4cc1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGluZmluaXR5JTIwcG9vbCUyMG9jZWFuJTIwdmlld3xlbnwwfDB8fHwxNzcwODk1ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
 ARRAY['https://images.unsplash.com/photo-1760564019062-7e7efdf4cc1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB2aWxsYSUyMGluZmluaXR5JTIwcG9vbCUyMG9jZWFuJTIwdmlld3xlbnwwfDB8fHwxNzcwODk1ODc2fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1548386704-23fc0135faab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1626724657306-1e58a0b111b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw4fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1760681552499-eeecfa20d110?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjBwb29sJTIwdmlsbGElMjBzdW5zZXR8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'],
 'available', 'freehold', NULL, 'pink_zone',
 '坐落于乌鲁瓦图壮丽的断崖之上，拥有270度无死角海景。建筑采用大量石灰石与天然原木，营造出一种宁静而充满力量感的居住氛围。',
 'Perched on the magnificent cliffs of Uluwatu with 270-degree unobstructed ocean views.',
 true, ARRAY['海景房', '私人沙滩'], -8.8449, 115.0849),

-- prop-003: 林间静邸
('prop-003', '林间静邸', 'Forest Zen Retreat', 850000, '乌布中心', 'Ubud Center', '生态别墅', 'Eco Villa',
 3, 3, 450, 310, 'https://images.unsplash.com/photo-1596010179162-bfdca08fd5a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaGZyb250JTIwdmlsbGElMjBvY2VhbiUyMHZpZXclMjBzdW5zZXR8ZW58MHwwfHxibHVlfDE3NzA4OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
 ARRAY['https://images.unsplash.com/photo-1596010179162-bfdca08fd5a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaGZyb250JTIwdmlsbGElMjBvY2VhbiUyMHZpZXclMjBzdW5zZXR8ZW58MHwwfHxibHVlfDE3NzA4OTU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1728048756766-55208c6feb87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwxfHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw3fHxiYWxpJTIwbHV4dXJ5JTIwdmlsbGElMjB0cm9waWNhbCUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcwODg4OTA1fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1578754067449-838743bcec20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw4fHxiYWxpJTIwdHJvcGljYWwlMjBsYW5kc2NhcGUlMjByaWNlJTIwdGVycmFjZXN8ZW58MHwwfHx8MTc3MDg4ODkwNXww&ixlib=rb-4.1.0&q=80&w=1080'],
 'available', 'leasehold', 30, 'green_zone',
 '被乌布翠绿的梯田与雨林包围，这里是远离尘嚣的避风港。室内设计强调"少即是多"，每一处细节都经过精心雕琢。',
 'Surrounded by Ubud''s lush terraces and rainforest, this sanctuary offers a "less is more" design.',
 true, ARRAY['自然风景房', '稻田景观', '温泉度假村'], -8.5069, 115.2625);