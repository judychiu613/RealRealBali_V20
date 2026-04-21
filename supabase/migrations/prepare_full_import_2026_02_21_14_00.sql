-- 清空现有数据，准备重新导入完整的50个房产
TRUNCATE TABLE public.properties_2026_02_21_08_00 CASCADE;
TRUNCATE TABLE public.property_images_2026_02_21_08_00 CASCADE;

-- 确保区域和类型数据完整
INSERT INTO public.property_areas_2026_02_21_08_00 (name_en, name_zh, slug, description_en, description_zh)
VALUES 
  ('Echo Beach', '回声海滩', 'echo-beach', 'Famous surf spot in Canggu', '仓古著名冲浪点'),
  ('Bingin', '宾金', 'bingin', 'Clifftop location in Uluwatu', '乌鲁瓦图悬崖位置'),
  ('Ubud Center', '乌布中心', 'ubud-center', 'Cultural heart of Bali', '巴厘岛文化中心'),
  ('Pererenan', '佩雷雷南', 'pererenan', 'Quiet rice field area', '宁静稻田区域'),
  ('Seminyak', '水明漾', 'seminyak', 'Upscale beach town', '高档海滨小镇'),
  ('Jimbaran', '金巴兰', 'jimbaran', 'Famous for seafood and sunsets', '以海鲜和日落闻名'),
  ('Sanur', '萨努尔', 'sanur', 'Calm beach with traditional charm', '宁静海滩传统魅力'),
  ('Canggu', '仓古', 'canggu', 'Hip surf town with beach clubs', '时尚冲浪小镇'),
  ('Uluwatu', '乌鲁瓦图', 'uluwatu', 'Dramatic clifftop location', '壮观悬崖位置'),
  ('Ubud', '乌布', 'ubud', 'Cultural and spiritual center', '文化精神中心')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.property_types_2026_02_21_08_00 (name_en, name_zh, slug, description_en, description_zh)
VALUES 
  ('Luxury Villa', '豪华别墅', 'luxury-villa', 'High-end private villa', '高端私人别墅'),
  ('Beachfront Villa', '海滨别墅', 'beachfront-villa', 'Villa with beach access', '海滨别墅'),
  ('Eco Villa', '生态别墅', 'eco-villa', 'Environmentally friendly villa', '环保别墅'),
  ('Mountain Villa', '山景别墅', 'mountain-villa', 'Villa with mountain views', '山景别墅'),
  ('Beachfront Property', '海滨物业', 'beachfront-property', 'Property with beach access', '海滨物业'),
  ('Music Villa', '音乐别墅', 'music-villa', 'Villa with music studio', '音乐工作室别墅'),
  ('Private Villa', '私密别墅', 'private-villa', 'Ultra private villa', '超私密别墅'),
  ('Honeymoon Villa', '蜜月别墅', 'honeymoon-villa', 'Romantic villa for couples', '浪漫情侣别墅'),
  ('Business Villa', '商务别墅', 'business-villa', 'Villa for business use', '商务用途别墅'),
  ('Co-living Villa', '共享别墅', 'co-living-villa', 'Shared living space', '共享生活空间'),
  ('Retirement Villa', '养老别墅', 'retirement-villa', 'Villa for retirement', '养老别墅'),
  ('Family Villa', '家庭别墅', 'family-villa', 'Family-friendly villa', '家庭友好别墅'),
  ('Pet Villa', '宠物别墅', 'pet-villa', 'Pet-friendly villa', '宠物友好别墅'),
  ('Sports Base', '运动基地', 'sports-base', 'Villa with sports facilities', '运动设施别墅'),
  ('Culinary Estate', '美食庄园', 'culinary-estate', 'Villa with professional kitchen', '专业厨房庄园'),
  ('Futuristic Villa', '未来别墅', 'futuristic-villa', 'High-tech modern villa', '高科技现代别墅')
ON CONFLICT (slug) DO NOTHING;