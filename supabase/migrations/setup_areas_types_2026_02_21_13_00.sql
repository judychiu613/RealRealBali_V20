-- 清空现有房产数据
TRUNCATE TABLE public.properties_2026_02_21_08_00 CASCADE;
TRUNCATE TABLE public.property_images_2026_02_21_08_00 CASCADE;

-- 首先插入区域数据（如果不存在）
INSERT INTO public.property_areas_2026_02_21_08_00 (name_en, name_zh, slug, description_en, description_zh)
VALUES 
  ('Echo Beach', '回声海滩', 'echo-beach', 'Famous surf spot in Canggu', '仓古著名冲浪点'),
  ('Bingin', '宾金', 'bingin', 'Clifftop location in Uluwatu', '乌鲁瓦图悬崖位置'),
  ('Ubud Center', '乌布中心', 'ubud-center', 'Cultural heart of Bali', '巴厘岛文化中心'),
  ('Pererenan', '佩雷雷南', 'pererenan', 'Quiet rice field area', '宁静稻田区域'),
  ('Seminyak', '水明漾', 'seminyak', 'Upscale beach town', '高档海滨小镇'),
  ('Jimbaran', '金巴兰', 'jimbaran', 'Famous for seafood and sunsets', '以海鲜和日落闻名')
ON CONFLICT (slug) DO NOTHING;

-- 插入房产类型数据（如果不存在）
INSERT INTO public.property_types_2026_02_21_08_00 (name_en, name_zh, slug, description_en, description_zh)
VALUES 
  ('Luxury Villa', '豪华别墅', 'luxury-villa', 'High-end private villa', '高端私人别墅'),
  ('Beachfront Villa', '海滨别墅', 'beachfront-villa', 'Villa with beach access', '海滨别墅'),
  ('Eco Villa', '生态别墅', 'eco-villa', 'Environmentally friendly villa', '环保别墅'),
  ('Mountain Villa', '山景别墅', 'mountain-villa', 'Villa with mountain views', '山景别墅'),
  ('Beachfront Property', '海滨物业', 'beachfront-property', 'Property with beach access', '海滨物业')
ON CONFLICT (slug) DO NOTHING;