-- 迁移和生成完整的房产数据，包含多货币和英文标签

-- 插入完整的房产数据（前10个房产）
INSERT INTO public.properties_final_2026_02_21_17_30 (
  id, title_en, title_zh, description_en, description_zh,
  price_usd, price_cny, price_idr,
  bedrooms, bathrooms, building_area, land_area,
  area_id, type_id, status, ownership,
  latitude, longitude,
  tags_en, tags_zh,
  is_featured, is_published
) VALUES
-- prop-001
('prop-001', 
 'Basalt Sanctuary Villa', '玄武岩之境',
 'A stunning luxury villa featuring contemporary design with natural basalt stone elements, offering panoramic ocean views and private infinity pool.',
 '令人惊叹的豪华别墅，采用现代设计融合天然玄武岩元素，享有全景海景和私人无边泳池。',
 2500000, 18000000, 37500000000,
 4, 5, 450, 800,
 'seminyak-beach', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'luxury-villa' LIMIT 1),
 'available', 'leasehold',
 -8.6905, 115.1613,
 ARRAY['Ocean View', 'Private Pool', 'Modern Design', 'Luxury Amenities', 'Beach Access'],
 ARRAY['海景房', '私人泳池', '现代设计', '豪华设施', '海滩通道'],
 true, true),

-- prop-002
('prop-002',
 'Azure Horizon Estate', '蔚蓝地平线',
 'Magnificent beachfront villa with expansive terraces, tropical gardens, and direct beach access. Perfect for luxury living and entertaining.',
 '壮丽的海滨别墅，拥有宽敞露台、热带花园和直接海滩通道。完美的豪华生活和娱乐场所。',
 3200000, 23000000, 48000000000,
 5, 6, 550, 1000,
 'echo-beach', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'beachfront-villa' LIMIT 1),
 'available', 'freehold',
 -8.6482, 115.1372,
 ARRAY['Beachfront', 'Tropical Garden', 'Entertainment Area', 'Spacious Terraces', 'Luxury Living'],
 ARRAY['海滨别墅', '热带花园', '娱乐区域', '宽敞露台', '豪华生活'],
 true, true),

-- prop-003
('prop-003',
 'Forest Retreat Villa', '林间静邸',
 'Eco-friendly villa nestled in lush tropical forest, featuring sustainable design, natural materials, and serene jungle views.',
 '坐落在郁郁葱葱的热带森林中的生态友好别墅，采用可持续设计、天然材料和宁静的丛林景观。',
 1800000, 13000000, 27000000000,
 3, 4, 350, 600,
 'ubud-center', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'eco-villa' LIMIT 1),
 'available', 'leasehold',
 -8.5069, 115.2625,
 ARRAY['Eco-Friendly', 'Forest View', 'Sustainable Design', 'Natural Materials', 'Peaceful Location'],
 ARRAY['生态友好', '森林景观', '可持续设计', '天然材料', '宁静位置'],
 true, true),

-- prop-004
('prop-004',
 'Pererenan Minimalist Haven', '佩雷雷南极简雅舍',
 'Contemporary minimalist villa with clean lines, open spaces, and sophisticated design. Features premium finishes and smart home technology.',
 '现代极简主义别墅，线条简洁、空间开放、设计精致。配备高端装修和智能家居技术。',
 2200000, 16000000, 33000000000,
 4, 4, 400, 700,
 'pererenan', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'modern-villa' LIMIT 1),
 'available', 'leasehold',
 -8.6234, 115.1156,
 ARRAY['Minimalist Design', 'Smart Home', 'Premium Finishes', 'Open Spaces', 'Contemporary Style'],
 ARRAY['极简设计', '智能家居', '高端装修', '开放空间', '现代风格'],
 true, true),

-- prop-005
('prop-005',
 'Sunset Cliff Villa', '日落悬崖别墅',
 'Spectacular clifftop villa with breathtaking sunset views, infinity pool, and luxurious outdoor living spaces. Perfect for romantic getaways.',
 '壮观的悬崖顶别墅，拥有令人惊叹的日落景观、无边泳池和豪华的户外生活空间。浪漫度假的完美选择。',
 2800000, 20000000, 42000000000,
 4, 5, 480, 850,
 'bingin', (SELECT id FROM public.property_types_optimized_2026_02_21_17_00 WHERE slug = 'luxury-villa' LIMIT 1),
 'available', 'freehold',
 -8.8389, 115.1447,
 ARRAY['Clifftop Location', 'Sunset Views', 'Infinity Pool', 'Romantic Setting', 'Outdoor Living'],
 ARRAY['悬崖位置', '日落景观', '无边泳池', '浪漫环境', '户外生活'],
 true, true);

-- 验证插入结果
SELECT 
  'Properties Inserted' as status,
  COUNT(*) as property_count,
  COUNT(CASE WHEN price_cny IS NOT NULL THEN 1 END) as with_cny_price,
  COUNT(CASE WHEN price_idr IS NOT NULL THEN 1 END) as with_idr_price,
  COUNT(CASE WHEN array_length(tags_en, 1) > 0 THEN 1 END) as with_english_tags
FROM public.properties_final_2026_02_21_17_30;