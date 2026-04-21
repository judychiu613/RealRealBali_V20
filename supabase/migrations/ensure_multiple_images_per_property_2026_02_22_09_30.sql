-- 为所有房源添加更多图片，确保每个房源至少有3张图片
-- 首先删除只有1张图片的房源的现有图片
DELETE FROM public.property_images 
WHERE property_id NOT IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005');

-- 为所有其他房源添加3张图片
INSERT INTO public.property_images (property_id, image_url, sort_order)
SELECT 
    p.id,
    CASE 
        WHEN s.sort_order = 1 THEN 'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN s.sort_order = 2 THEN 'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN s.sort_order = 3 THEN 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
    END,
    s.sort_order
FROM public.properties_final_2026_02_21_17_30 p
CROSS JOIN (SELECT 1 as sort_order UNION SELECT 2 UNION SELECT 3) s
WHERE p.id NOT IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005');

-- 验证每个房源的图片数量
SELECT property_id, COUNT(*) as image_count
FROM public.property_images 
GROUP BY property_id
ORDER BY property_id
LIMIT 10;