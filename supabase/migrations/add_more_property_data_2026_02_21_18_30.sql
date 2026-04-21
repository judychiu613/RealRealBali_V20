-- 检查当前房产数据并添加更多数据

-- 1. 查看当前房产数据
SELECT 
  id,
  title_zh,
  title_en,
  is_published,
  is_featured,
  price_usd
FROM public.properties_final_2026_02_21_17_30
ORDER BY id;

-- 2. 如果数据不足，添加更多房产数据
INSERT INTO public.properties_final_2026_02_21_17_30 (
  id, title_zh, title_en, description_zh, description_en,
  price_usd, price_cny, price_idr,
  bedrooms, bathrooms, building_area, land_area,
  area_id, type_id, status, ownership,
  tags_zh, tags_en,
  is_published, is_featured,
  latitude, longitude
) VALUES 
-- prop-009: 乌布森林别墅
('prop-009', '乌布森林别墅', 'Ubud Forest Villa', 
 '隐藏在乌布热带雨林中的生态别墅，享受纯净的自然环境和传统巴厘岛文化。', 
 'An eco villa hidden in Ubud tropical rainforest, enjoying pure natural environment and traditional Balinese culture.',
 1800000, 12960000, 27000000000,
 4, 3, 350, 800,
 'ubud-center', (SELECT id FROM public.property_types_final_2026_02_21_17_30 WHERE slug = 'eco-villa' LIMIT 1),
 'available', 'leasehold',
 ARRAY['森林景观', '生态建筑', '瑜伽空间', '有机菜园'], 
 ARRAY['Forest View', 'Eco Building', 'Yoga Space', 'Organic Garden'],
 true, true,
 -8.5069, 115.2625),

-- prop-010: 金巴兰海滩度假村
('prop-010', '金巴兰海滩度假村', 'Jimbaran Beach Resort Villa', 
 '位于金巴兰海滩的豪华度假别墅，享受日落美景和新鲜海鲜。', 
 'Luxury resort villa located at Jimbaran Beach, enjoying sunset views and fresh seafood.',
 3200000, 23040000, 48000000000,
 5, 4, 450, 1000,
 'jimbaran', (SELECT id FROM public.property_types_final_2026_02_21_17_30 WHERE slug = 'beachfront-villa' LIMIT 1),
 'available', 'freehold',
 ARRAY['海滩位置', '日落景观', '私人泳池', '海鲜餐厅'], 
 ARRAY['Beachfront Location', 'Sunset View', 'Private Pool', 'Seafood Restaurant'],
 true, true,
 -8.7983, 115.1635),

-- prop-011: 努沙杜瓦高尔夫别墅
('prop-011', '努沙杜瓦高尔夫别墅', 'Nusa Dua Golf Villa', 
 '坐落在努沙杜瓦高尔夫球场旁的现代别墅，享受高端度假体验。', 
 'Modern villa located next to Nusa Dua golf course, enjoying premium resort experience.',
 2800000, 20160000, 42000000000,
 4, 3, 400, 900,
 'nusa-dua', (SELECT id FROM public.property_types_final_2026_02_21_17_30 WHERE slug = 'modern-villa' LIMIT 1),
 'available', 'freehold',
 ARRAY['高尔夫球场', '度假村设施', '现代设计', '管家服务'], 
 ARRAY['Golf Course', 'Resort Facilities', 'Modern Design', 'Butler Service'],
 true, true,
 -8.8017, 115.2289),

-- prop-012: 萨努尔传统别墅
('prop-012', '萨努尔传统别墅', 'Sanur Traditional Villa', 
 '融合传统巴厘岛建筑风格的别墅，位于宁静的萨努尔海滩区域。', 
 'Villa combining traditional Balinese architectural style, located in peaceful Sanur beach area.',
 2100000, 15120000, 31500000000,
 3, 2, 300, 700,
 'sanur', (SELECT id FROM public.property_types_final_2026_02_21_17_30 WHERE slug = 'tropical-villa' LIMIT 1),
 'available', 'leasehold',
 ARRAY['传统建筑', '宁静海滩', '文化体验', '艺术工作室'], 
 ARRAY['Traditional Architecture', 'Peaceful Beach', 'Cultural Experience', 'Art Studio'],
 true, true,
 -8.6847, 115.2623);

-- 3. 验证插入结果
SELECT 
  'Updated Property Count' as status,
  COUNT(*) as total_properties,
  COUNT(CASE WHEN is_published = true THEN 1 END) as published_properties,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_properties
FROM public.properties_final_2026_02_21_17_30;