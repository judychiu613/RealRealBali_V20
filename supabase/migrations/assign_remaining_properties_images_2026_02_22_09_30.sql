-- 为剩余房源分配新的Unsplash图片，使用刚才搜索到的图片
-- 使用IMAGES中的新图片URL

-- prop-006: 3张图片 (使用VILLA_LUXURY系列)
INSERT INTO public.property_images (property_id, image_url, sort_order) VALUES
('prop-006', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-006', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-006', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 3),

-- prop-007: 5张图片 (使用HOUSE_MODERN系列)
('prop-007', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-007', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-007', 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 3),
('prop-007', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 4),
('prop-007', 'https://images.unsplash.com/photo-1600566752734-d1d394c725dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw4fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 5),

-- prop-008: 6张图片 (使用POOL_TROPICAL系列)
('prop-008', 'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-008', 'https://images.unsplash.com/photo-1762117361030-a23ec89aa218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-008', 'https://images.unsplash.com/photo-1764339441207-c55b7ae4a15e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 3),
('prop-008', 'https://images.unsplash.com/photo-1760564019101-c265521c08f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw2fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 4),
('prop-008', 'https://images.unsplash.com/photo-1767900009999-b60bcbaffb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 5),
('prop-008', 'https://images.unsplash.com/photo-1768000010004-b60bcbaffb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw4fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 6),

-- prop-009: 4张图片 (使用INTERIOR_BALI系列)
('prop-009', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw5fHxiYWxpJTIwdmlsbGElMjBpbnRlcmlvcnxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-009', 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxMHx8YmFsaSUyMHZpbGxhJTIwaW50ZXJpb3J8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-009', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxfHxiYWxpJTIwdmlsbGElMjBpbnRlcmlvcnxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 3),
('prop-009', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwyfHxiYWxpJTIwdmlsbGElMjBpbnRlcmlvcnxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 4),

-- prop-010: 7张图片 (使用OCEAN_VIEW系列)
('prop-010', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHxvY2VhbiUyMHZpZXclMjBwcm9wZXJ0eXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-010', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHxvY2VhbiUyMHZpZXclMjBwcm9wZXJ0eXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-010', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHxvY2VhbiUyMHZpZXclMjBwcm9wZXJ0eXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 3),
('prop-010', 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw2fHxvY2VhbiUyMHZpZXclMjBwcm9wZXJ0eXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 4),
('prop-010', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHxvY2VhbiUyMHZpZXclMjBwcm9wZXJ0eXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 5),
('prop-010', 'https://images.unsplash.com/photo-1600566752734-d1d394c725dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw4fHxvY2VhbiUyMHZpZXclMjBwcm9wZXJ0eXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 6),
('prop-010', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw5fHxvY2VhbiUyMHZpZXclMjBwcm9wZXJ0eXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 7);

-- 为其他房源添加默认图片组合（3-8张不等）
-- 使用循环方式为剩余房源分配图片
INSERT INTO public.property_images (property_id, image_url, sort_order)
SELECT 
    p.id,
    CASE 
        WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.sort_order)) % 10 = 1 THEN 'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.sort_order)) % 10 = 2 THEN 'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.sort_order)) % 10 = 3 THEN 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.sort_order)) % 10 = 4 THEN 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.sort_order)) % 10 = 5 THEN 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.sort_order)) % 10 = 6 THEN 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.sort_order)) % 10 = 7 THEN 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.sort_order)) % 10 = 8 THEN 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY s.sort_order)) % 10 = 9 THEN 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw2fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080'
        ELSE 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    END,
    s.sort_order
FROM public.properties_final_2026_02_21_17_30 p
CROSS JOIN (
    SELECT 1 as sort_order UNION SELECT 2 UNION SELECT 3 UNION 
    SELECT 4 UNION SELECT 5 UNION SELECT 6
) s
WHERE p.id NOT IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005', 'prop-006', 'prop-007', 'prop-008', 'prop-009', 'prop-010')
AND (
    -- 不同房源有不同的图片数量 (3-8张)
    (p.id LIKE '%1%' AND s.sort_order <= 3) OR  -- 以1结尾的房源：3张
    (p.id LIKE '%2%' AND s.sort_order <= 4) OR  -- 以2结尾的房源：4张
    (p.id LIKE '%3%' AND s.sort_order <= 5) OR  -- 以3结尾的房源：5张
    (p.id LIKE '%4%' AND s.sort_order <= 6) OR  -- 以4结尾的房源：6张
    (p.id LIKE '%5%' AND s.sort_order <= 7) OR  -- 以5结尾的房源：7张
    (p.id LIKE '%6%' AND s.sort_order <= 8) OR  -- 以6结尾的房源：8张
    (p.id LIKE '%7%' AND s.sort_order <= 3) OR  -- 以7结尾的房源：3张
    (p.id LIKE '%8%' AND s.sort_order <= 4) OR  -- 以8结尾的房源：4张
    (p.id LIKE '%9%' AND s.sort_order <= 5) OR  -- 以9结尾的房源：5张
    (p.id LIKE '%0%' AND s.sort_order <= 6)     -- 以0结尾的房源：6张
);