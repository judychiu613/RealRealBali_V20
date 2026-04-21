-- 清空现有的图片数据
DELETE FROM public.property_images;

-- 为每个房源分配不同数量和类型的图片
-- prop-001: 5张图片 (豪华别墅)
INSERT INTO public.property_images (property_id, image_url, sort_order) VALUES
('prop-001', 'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-001', 'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-001', 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 3),
('prop-001', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 4),
('prop-001', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 5),

-- prop-002: 7张图片 (现代别墅)
('prop-002', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-002', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-002', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 3),
('prop-002', 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw2fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 4),
('prop-002', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 5),
('prop-002', 'https://images.unsplash.com/photo-1600566752734-d1d394c725dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw4fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 6),
('prop-002', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw5fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 7),

-- prop-003: 4张图片 (海景别墅)
('prop-003', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-003', 'https://images.unsplash.com/photo-1600566752734-d1d394c725dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw4fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-003', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw5fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 3),
('prop-003', 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxMHx8bW9kZXJuJTIwaG91c2UlMjBhcmNoaXRlY3R1cmV8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 4),

-- prop-004: 6张图片 (热带度假村)
('prop-004', 'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-004', 'https://images.unsplash.com/photo-1762117361030-a23ec89aa218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-004', 'https://images.unsplash.com/photo-1764339441207-c55b7ae4a15e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 3),
('prop-004', 'https://images.unsplash.com/photo-1760564019101-c265521c08f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw2fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 4),
('prop-004', 'https://images.unsplash.com/photo-1767900009999-b60bcbaffb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 5),
('prop-004', 'https://images.unsplash.com/photo-1768000010004-b60bcbaffb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw4fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 6),

-- prop-005: 8张图片 (山景别墅)
('prop-005', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-005', 'https://images.unsplash.com/photo-1600566752734-d1d394c725dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw4fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-005', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw5fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 3),
('prop-005', 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxMHx8bW9kZXJuJTIwaG91c2UlMjBhcmNoaXRlY3R1cmV8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 4),
('prop-005', 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 5),
('prop-005', 'https://images.unsplash.com/photo-1600566752734-d1d394c725dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw4fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 6),
('prop-005', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw5fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzU0NzE5fDA&ixlib=rb-4.1.0&q=80&w=1080', 7),
('prop-005', 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxMHx8bW9kZXJuJTIwaG91c2UlMjBhcmNoaXRlY3R1cmV8ZW58MHwwfHx8MTc3MTc1NDcxOXww&ixlib=rb-4.1.0&q=80&w=1080', 8);