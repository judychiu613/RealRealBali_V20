-- 插入更多房产数据（prop-006到prop-020）

INSERT INTO public.properties_final_2026_02_21_17_30 (
  id, title_en, title_zh, description_en, description_zh,
  price_usd, price_cny, price_idr,
  bedrooms, bathrooms, building_area, land_area,
  area_id, type_id, status, ownership,
  latitude, longitude,
  tags_en, tags_zh,
  is_featured, is_published
) VALUES
-- prop-006 到 prop-020
('prop-006', 'Tropical Paradise Villa', '热带天堂别墅', 'Luxurious tropical villa with lush gardens and pool', '拥有郁郁葱葱花园和泳池的豪华热带别墅', 1950000, 14000000, 29250000000, 3, 3, 320, 550, 'seminyak-center', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'tropical-villa' LIMIT 1), 'available', 'leasehold', -8.6905, 115.1613, ARRAY['Tropical Garden', 'Swimming Pool', 'Luxury Design'], ARRAY['热带花园', '游泳池', '豪华设计'], true, true),

('prop-007', 'Modern Zen Retreat', '现代禅意静修', 'Contemporary villa with zen-inspired design and meditation spaces', '具有禅意设计和冥想空间的现代别墅', 2100000, 15000000, 31500000000, 4, 4, 380, 650, 'ubud-center', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'modern-villa' LIMIT 1), 'available', 'freehold', -8.5069, 115.2625, ARRAY['Zen Design', 'Meditation Space', 'Contemporary Style'], ARRAY['禅意设计', '冥想空间', '现代风格'], true, true),

('prop-008', 'Beachside Luxury Estate', '海滨豪华庄园', 'Expansive beachfront estate with multiple pavilions', '拥有多个亭台的宽敞海滨庄园', 4500000, 32000000, 67500000000, 6, 7, 650, 1200, 'echo-beach', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'luxury-villa' LIMIT 1), 'available', 'freehold', -8.6482, 115.1372, ARRAY['Beachfront', 'Multiple Pavilions', 'Luxury Estate'], ARRAY['海滨别墅', '多个亭台', '豪华庄园'], true, true),

('prop-009', 'Clifftop Sanctuary', '悬崖圣殿', 'Dramatic clifftop villa with panoramic ocean views', '拥有全景海景的戏剧性悬崖别墅', 3500000, 25000000, 52500000000, 5, 5, 500, 900, 'bingin', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'luxury-villa' LIMIT 1), 'available', 'leasehold', -8.8389, 115.1447, ARRAY['Clifftop', 'Ocean Views', 'Dramatic Design'], ARRAY['悬崖位置', '海景', '戏剧性设计'], true, true),

('prop-010', 'Rice Field Villa', '稻田别墅', 'Peaceful villa overlooking emerald rice terraces', '俯瞰翠绿稻田梯田的宁静别墅', 1600000, 11500000, 24000000000, 3, 3, 280, 500, 'tegallalang', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'eco-villa' LIMIT 1), 'available', 'leasehold', -8.4305, 115.2735, ARRAY['Rice Field Views', 'Peaceful Location', 'Traditional Design'], ARRAY['稻田景观', '宁静位置', '传统设计'], true, true),

('prop-011', 'Surf Villa Paradise', '冲浪天堂别墅', 'Perfect villa for surf enthusiasts with beach access', '拥有海滩通道的冲浪爱好者完美别墅', 2300000, 16500000, 34500000000, 4, 4, 420, 750, 'berawa', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'beachfront-villa' LIMIT 1), 'available', 'freehold', -8.6234, 115.1156, ARRAY['Surf Access', 'Beach Location', 'Modern Amenities'], ARRAY['冲浪通道', '海滩位置', '现代设施'], true, true),

('prop-012', 'Garden Oasis Villa', '花园绿洲别墅', 'Tranquil villa surrounded by tropical gardens', '被热带花园环绕的宁静别墅', 1750000, 12500000, 26250000000, 3, 4, 340, 600, 'petitenget', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'tropical-villa' LIMIT 1), 'available', 'leasehold', -8.6905, 115.1613, ARRAY['Garden Views', 'Tranquil Setting', 'Tropical Design'], ARRAY['花园景观', '宁静环境', '热带设计'], true, true),

('prop-013', 'Contemporary Masterpiece', '现代杰作', 'Architectural masterpiece with cutting-edge design', '具有前沿设计的建筑杰作', 3800000, 27000000, 57000000000, 5, 6, 580, 1000, 'seminyak-beach', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'modern-villa' LIMIT 1), 'available', 'freehold', -8.6905, 115.1613, ARRAY['Architectural Design', 'Contemporary Style', 'Cutting-edge Features'], ARRAY['建筑设计', '现代风格', '前沿功能'], true, true),

('prop-014', 'Jungle Hideaway', '丛林隐居', 'Secluded villa nestled in pristine jungle setting', '坐落在原始丛林环境中的隐蔽别墅', 1400000, 10000000, 21000000000, 2, 3, 250, 400, 'mas', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'eco-villa' LIMIT 1), 'available', 'leasehold', -8.5069, 115.2625, ARRAY['Jungle Setting', 'Secluded Location', 'Eco-friendly'], ARRAY['丛林环境', '隐蔽位置', '生态友好'], true, true),

('prop-015', 'Sunset Terrace Villa', '日落露台别墅', 'Villa with spectacular sunset viewing terraces', '拥有壮观日落观景露台的别墅', 2600000, 18500000, 39000000000, 4, 5, 460, 800, 'padang-padang', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'luxury-villa' LIMIT 1), 'available', 'leasehold', -8.8389, 115.1447, ARRAY['Sunset Views', 'Viewing Terraces', 'Luxury Amenities'], ARRAY['日落景观', '观景露台', '豪华设施'], true, true);

-- 验证插入结果
SELECT 
  'Total Properties' as status,
  COUNT(*) as property_count,
  MIN(id) as first_property,
  MAX(id) as last_property
FROM public.properties_final_2026_02_21_17_30;