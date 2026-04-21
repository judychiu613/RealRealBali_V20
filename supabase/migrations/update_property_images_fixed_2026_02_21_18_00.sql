-- 清空现有图片数据
DELETE FROM public.property_images_final_2026_02_21_17_30;

-- 插入可靠的高质量图片数据（使用正确的列名）
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, sort_order) VALUES

-- prop-001 (玄武岩之境) - 豪华别墅
('prop-001', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&crop=center', 'exterior', 1),
('prop-001', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=center', 'interior', 2),
('prop-001', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&crop=center', 'view', 3),
('prop-001', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop&crop=center', 'general', 4),

-- prop-002 (蔚蓝地平线) - 海景别墅
('prop-002', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop&crop=center', 'exterior', 1),
('prop-002', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop&crop=center', 'interior', 2),
('prop-002', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center', 'view', 3),
('prop-002', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop&crop=center', 'general', 4),

-- prop-003 (林间静邸) - 生态别墅
('prop-003', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop&crop=center', 'exterior', 1),
('prop-003', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop&crop=center', 'interior', 2),
('prop-003', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop&crop=center', 'view', 3),
('prop-003', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop&crop=center', 'general', 4),

-- prop-004 (佩雷雷南极简雅舍) - 现代别墅
('prop-004', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop&crop=center', 'exterior', 1),
('prop-004', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&crop=center', 'interior', 2),
('prop-004', 'https://images.unsplash.com/photo-1600585154084-fb1ab39597ce?w=800&h=600&fit=crop&crop=center', 'view', 3),
('prop-004', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop&crop=center', 'general', 4),

-- prop-005 (翡翠湾秘境) - 度假别墅
('prop-005', 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop&crop=center', 'exterior', 1),
('prop-005', 'https://images.unsplash.com/photo-1600566752734-d1d394a5d99f?w=800&h=600&fit=crop&crop=center', 'interior', 2),
('prop-005', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop&crop=center', 'view', 3),
('prop-005', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center', 'general', 4),

-- prop-006 (天堂海岸线) - 海滨别墅
('prop-006', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&crop=center', 'exterior', 1),
('prop-006', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=center', 'interior', 2),
('prop-006', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop&crop=center', 'view', 3),
('prop-006', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&crop=center', 'general', 4),

-- prop-007 (乌布森林隐居) - 森林别墅
('prop-007', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop&crop=center', 'exterior', 1),
('prop-007', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop&crop=center', 'interior', 2),
('prop-007', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&crop=center', 'view', 3),
('prop-007', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop&crop=center', 'general', 4),

-- prop-008 (金巴兰日落台) - 日落别墅
('prop-008', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop&crop=center', 'exterior', 1),
('prop-008', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop&crop=center', 'interior', 2),
('prop-008', 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop&crop=center', 'view', 3),
('prop-008', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop&crop=center', 'general', 4);