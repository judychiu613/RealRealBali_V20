-- 为不同房产添加不同的图片，解决图片轮播重复问题

-- 首先清空现有图片数据
DELETE FROM public.property_images_final_2026_02_21_17_30;

-- 为每个房产添加不同的高质量图片
-- prop-001: 玄武岩之境 (豪华别墅)
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order) VALUES
('prop-001', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'exterior', true, 1),
('prop-001', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'interior', false, 2),
('prop-001', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800', 'view', false, 3),
('prop-001', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'general', false, 4);

-- prop-002: 蔚蓝地平线 (海滨别墅)
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order) VALUES
('prop-002', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'exterior', true, 1),
('prop-002', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'interior', false, 2),
('prop-002', 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=800', 'view', false, 3),
('prop-002', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'general', false, 4);

-- prop-003: 林间静邸 (生态别墅)
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order) VALUES
('prop-003', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'exterior', true, 1),
('prop-003', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 'interior', false, 2),
('prop-003', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'view', false, 3),
('prop-003', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800', 'general', false, 4);

-- prop-004: 佩雷雷南极简雅舍 (现代别墅)
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order) VALUES
('prop-004', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'exterior', true, 1),
('prop-004', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 'interior', false, 2),
('prop-004', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'view', false, 3),
('prop-004', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'general', false, 4);

-- prop-005: 日落悬崖别墅 (豪华别墅)
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order) VALUES
('prop-005', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', 'exterior', true, 1),
('prop-005', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', 'interior', false, 2),
('prop-005', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'view', false, 3),
('prop-005', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800', 'general', false, 4);

-- prop-006: 热带天堂别墅 (热带别墅)
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order) VALUES
('prop-006', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'exterior', true, 1),
('prop-006', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'interior', false, 2),
('prop-006', 'https://images.unsplash.com/photo-1600566752229-450c5e0c8c4b?w=800', 'view', false, 3),
('prop-006', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'general', false, 4);

-- prop-007: 现代禅意静修 (现代别墅)
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order) VALUES
('prop-007', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', 'exterior', true, 1),
('prop-007', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', 'interior', false, 2),
('prop-007', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'view', false, 3),
('prop-007', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'general', false, 4);

-- prop-008: 海滨豪华庄园 (豪华别墅)
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order) VALUES
('prop-008', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', 'exterior', true, 1),
('prop-008', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'interior', false, 2),
('prop-008', 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=800', 'view', false, 3),
('prop-008', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'general', false, 4);

-- 验证图片数据
SELECT 
  'Image Distribution Check' as status,
  COUNT(*) as total_images,
  COUNT(DISTINCT property_id) as properties_with_images,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_images,
  ROUND(COUNT(*)::numeric / COUNT(DISTINCT property_id), 2) as avg_images_per_property
FROM public.property_images_final_2026_02_21_17_30;

-- 查看每个房产的图片分布
SELECT 
  property_id,
  COUNT(*) as image_count,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_count,
  STRING_AGG(image_type, ', ' ORDER BY sort_order) as image_types
FROM public.property_images_final_2026_02_21_17_30
GROUP BY property_id
ORDER BY property_id;