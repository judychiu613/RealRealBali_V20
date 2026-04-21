-- 为新别墅添加图片

-- 为新别墅添加图片
INSERT INTO public.property_images (property_id, image_url, sort_order, created_at, updated_at)
VALUES 
-- villa-007 乌布森林别墅 (5张图片)
('villa-007', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 1, now(), now()),
('villa-007', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', 2, now(), now()),
('villa-007', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop', 3, now(), now()),
('villa-007', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 4, now(), now()),
('villa-007', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 5, now(), now()),

-- villa-008 萨努尔海滨别墅 (4张图片)
('villa-008', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 1, now(), now()),
('villa-008', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 2, now(), now()),
('villa-008', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 3, now(), now()),
('villa-008', 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=800&h=600&fit=crop', 4, now(), now()),

-- villa-009 金巴兰山景别墅 (6张图片)
('villa-009', 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=800&h=600&fit=crop', 1, now(), now()),
('villa-009', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 2, now(), now()),
('villa-009', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 3, now(), now()),
('villa-009', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 4, now(), now()),
('villa-009', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', 5, now(), now()),
('villa-009', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop', 6, now(), now()),

-- villa-010 登巴萨市区别墅 (3张图片)
('villa-010', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', 1, now(), now()),
('villa-010', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', 2, now(), now()),
('villa-010', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop', 3, now(), now());

-- 验证图片插入
SELECT 
    pi.property_id, 
    p.title_zh,
    COUNT(pi.id) as image_count
FROM public.property_images pi
JOIN public.properties p ON pi.property_id = p.id
WHERE pi.property_id LIKE 'villa-0%'
GROUP BY pi.property_id, p.title_zh
ORDER BY pi.property_id;

-- 验证总别墅数量
SELECT 
    COUNT(*) as total_villas,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_villas,
    COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_villas
FROM public.properties 
WHERE type_id = 'villa';