-- 为新土地添加图片

-- 为土地房源添加图片
INSERT INTO public.property_images (property_id, image_url, sort_order, created_at, updated_at)
VALUES 
-- land-001 仓古海滨土地 (4张图片)
('land-001', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 1, now(), now()),
('land-001', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 2, now(), now()),
('land-001', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 3, now(), now()),
('land-001', 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=800&h=600&fit=crop', 4, now(), now()),

-- land-002 乌布梯田土地 (5张图片)
('land-002', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop', 1, now(), now()),
('land-002', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', 2, now(), now()),
('land-002', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', 3, now(), now()),
('land-002', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 4, now(), now()),
('land-002', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 5, now(), now()),

-- land-003 乌鲁瓦图悬崖土地 (6张图片)
('land-003', 'https://images.unsplash.com/photo-1520637736862-4d197d17c55a?w=800&h=600&fit=crop', 1, now(), now()),
('land-003', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 2, now(), now()),
('land-003', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 3, now(), now()),
('land-003', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 4, now(), now()),
('land-003', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', 5, now(), now()),
('land-003', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop', 6, now(), now()),

-- land-004 萨努尔商业土地 (3张图片)
('land-004', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', 1, now(), now()),
('land-004', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', 2, now(), now()),
('land-004', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop', 3, now(), now()),

-- land-005 金巴兰山坡土地 (4张图片)
('land-005', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 1, now(), now()),
('land-005', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 2, now(), now()),
('land-005', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop', 3, now(), now()),
('land-005', 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=800&h=600&fit=crop', 4, now(), now()),

-- land-006 登巴萨工业土地 (3张图片)
('land-006', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop', 1, now(), now()),
('land-006', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', 2, now(), now()),
('land-006', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop', 3, now(), now());

-- 验证图片插入
SELECT 
    pi.property_id, 
    p.title_zh,
    COUNT(pi.id) as image_count
FROM public.property_images pi
JOIN public.properties p ON pi.property_id = p.id
WHERE pi.property_id LIKE 'land-%'
GROUP BY pi.property_id, p.title_zh
ORDER BY pi.property_id;