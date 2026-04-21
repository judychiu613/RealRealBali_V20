-- 删除现有表（如果存在）
DROP TABLE IF EXISTS public.property_images CASCADE;

-- 重新创建property_images表
CREATE TABLE public.property_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (property_id) REFERENCES public.properties_final_2026_02_21_17_30(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_images_sort_order ON public.property_images(property_id, sort_order);

-- 插入房源图片数据
INSERT INTO public.property_images (property_id, image_url, sort_order) VALUES
-- prop-001 的图片
('prop-001', 'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-001', 'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-001', 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 3),

-- prop-002 的图片
('prop-002', 'https://images.unsplash.com/photo-1728048756938-de1ccee0ab15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-002', 'https://images.unsplash.com/photo-1762117361030-a23ec89aa218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-002', 'https://images.unsplash.com/photo-1728049006379-f1f2c3dbb910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwdmlsbGElMjBiYWxpfGVufDB8MHx8fDE3NzE3NTE0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', 3),

-- prop-003 的图片
('prop-003', 'https://images.unsplash.com/photo-1728049006379-f1f2c3dbb910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwdmlsbGElMjBiYWxpfGVufDB8MHx8fDE3NzE3NTE0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-003', 'https://images.unsplash.com/photo-1728049006363-f8e583040180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-003', 'https://images.unsplash.com/photo-1764339441207-c55b7ae4a15e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 3),

-- prop-004 的图片
('prop-004', 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-004', 'https://images.unsplash.com/photo-1728049006339-1cc328a28ab0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw4fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-004', 'https://images.unsplash.com/photo-1760564019101-c265521c08f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw2fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 3),

-- prop-005 的图片
('prop-005', 'https://images.unsplash.com/photo-1728050829093-9ee62013968a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 1),
('prop-005', 'https://images.unsplash.com/photo-1728048756857-d1ed820ea0e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 2),
('prop-005', 'https://images.unsplash.com/photo-1767900009999-b60bcbaffb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 3);

-- 为其他房源添加默认图片
INSERT INTO public.property_images (property_id, image_url, sort_order)
SELECT 
    p.id,
    'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    1
FROM public.properties_final_2026_02_21_17_30 p
WHERE p.id NOT IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005');