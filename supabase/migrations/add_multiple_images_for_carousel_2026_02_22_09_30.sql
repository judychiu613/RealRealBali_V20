-- 为所有房源添加更多图片，确保每个房源至少有3张图片
-- 首先删除只有1张图片的房源的现有图片
DELETE FROM public.property_images 
WHERE property_id NOT IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005');

-- 为所有房源重新插入3张图片
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

-- 为prop-006到prop-010添加更多不同的图片
INSERT INTO public.property_images (property_id, image_url, sort_order) VALUES
-- prop-006 的图片
('prop-006', 'https://images.unsplash.com/photo-1728049006363-f8e583040180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-006', 'https://images.unsplash.com/photo-1764339441207-c55b7ae4a15e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-006', 'https://images.unsplash.com/photo-1728048756857-d1ed820ea0e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 3),

-- prop-007 的图片
('prop-007', 'https://images.unsplash.com/photo-1728050829093-9ee62013968a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-007', 'https://images.unsplash.com/photo-1767900009999-b60bcbaffb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-007', 'https://images.unsplash.com/photo-1728048756779-ed7f123d371f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 3),

-- prop-008 的图片
('prop-008', 'https://images.unsplash.com/photo-1728048756779-ed7f123d371f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-008', 'https://images.unsplash.com/photo-1762117361030-a23ec89aa218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-008', 'https://images.unsplash.com/photo-1728049006379-f1f2c3dbb910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwdmlsbGElMjBiYWxpfGVufDB8MHx8fDE3NzE3NTE0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', 3),

-- prop-009 的图片
('prop-009', 'https://images.unsplash.com/photo-1760564019101-c265521c08f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw2fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-009', 'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-009', 'https://images.unsplash.com/photo-1728048756938-de1ccee0ab15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 3),

-- prop-010 的图片
('prop-010', 'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-010', 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-010', 'https://images.unsplash.com/photo-1767900009999-b60bcbaffb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 3)

ON CONFLICT (property_id, sort_order) DO NOTHING;