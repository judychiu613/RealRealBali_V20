-- 为新房产添加图片数据

-- 为 prop-009 到 prop-015 添加图片（如果存在的话）
INSERT INTO public.property_images_final_2026_02_21_17_30 (property_id, image_url, image_type, is_primary, sort_order) VALUES
-- prop-009: 乌布森林别墅 (生态别墅)
('prop-009', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'exterior', true, 1),
('prop-009', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 'interior', false, 2),
('prop-009', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 'view', false, 3),
('prop-009', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800', 'general', false, 4),

-- prop-010: 金巴兰海滩度假村 (海滨别墅)
('prop-010', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'exterior', true, 1),
('prop-010', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'interior', false, 2),
('prop-010', 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=800', 'view', false, 3),
('prop-010', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'general', false, 4),

-- prop-011: 努沙杜瓦高尔夫别墅 (现代别墅)
('prop-011', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'exterior', true, 1),
('prop-011', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', 'interior', false, 2),
('prop-011', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'view', false, 3),
('prop-011', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 'general', false, 4),

-- prop-012: 萨努尔传统别墅 (热带别墅)
('prop-012', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'exterior', true, 1),
('prop-012', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'interior', false, 2),
('prop-012', 'https://images.unsplash.com/photo-1600566752229-450c5e0c8c4b?w=800', 'view', false, 3),
('prop-012', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'general', false, 4)
ON CONFLICT (property_id, sort_order) DO NOTHING;

-- 验证图片数据
SELECT 
  'Image Data Status' as check_type,
  COUNT(*) as total_images,
  COUNT(DISTINCT property_id) as properties_with_images,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_images
FROM public.property_images_final_2026_02_21_17_30;

-- 查看每个房产的图片数量
SELECT 
  property_id,
  COUNT(*) as image_count
FROM public.property_images_final_2026_02_21_17_30
GROUP BY property_id
ORDER BY property_id;