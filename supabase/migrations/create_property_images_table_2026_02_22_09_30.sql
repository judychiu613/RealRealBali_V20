-- 创建property_images表
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (property_id) REFERENCES public.properties_final_2026_02_21_17_30(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_sort_order ON public.property_images(property_id, sort_order);

-- 插入房源图片数据
INSERT INTO public.property_images (property_id, image_url, alt_text, sort_order, is_main) VALUES
-- prop-001 的图片
('prop-001', 'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 'Basalt Sanctuary Villa - Main View', 1, true),
('prop-001', 'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 'Basalt Sanctuary Villa - Pool Area', 2, false),
('prop-001', 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 'Basalt Sanctuary Villa - Interior', 3, false),

-- prop-002 的图片
('prop-002', 'https://images.unsplash.com/photo-1728048756938-de1ccee0ab15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 'Emerald Haven Estate - Main View', 1, true),
('prop-002', 'https://images.unsplash.com/photo-1762117361030-a23ec89aa218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 'Emerald Haven Estate - Pool Deck', 2, false),
('prop-002', 'https://images.unsplash.com/photo-1728049006379-f1f2c3dbb910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwdmlsbGElMjBiYWxpfGVufDB8MHx8fDE3NzE3NTE0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', 'Emerald Haven Estate - Garden View', 3, false),

-- prop-003 的图片
('prop-003', 'https://images.unsplash.com/photo-1728049006379-f1f2c3dbb910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwdmlsbGElMjBiYWxpfGVufDB8MHx8fDE3NzE3NTE0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', 'Tropical Paradise Villa - Main View', 1, true),
('prop-003', 'https://images.unsplash.com/photo-1728049006363-f8e583040180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 'Tropical Paradise Villa - Exterior', 2, false),
('prop-003', 'https://images.unsplash.com/photo-1764339441207-c55b7ae4a15e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 'Tropical Paradise Villa - Pool Area', 3, false),

-- prop-004 的图片
('prop-004', 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 'Ocean Breeze Residence - Main View', 1, true),
('prop-004', 'https://images.unsplash.com/photo-1728049006339-1cc328a28ab0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw4fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 'Ocean Breeze Residence - Terrace', 2, false),
('prop-004', 'https://images.unsplash.com/photo-1760564019101-c265521c08f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw2fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 'Ocean Breeze Residence - Pool', 3, false),

-- prop-005 的图片
('prop-005', 'https://images.unsplash.com/photo-1728050829093-9ee62013968a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 'Sunset Ridge Villa - Main View', 1, true),
('prop-005', 'https://images.unsplash.com/photo-1728048756857-d1ed820ea0e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080', 'Sunset Ridge Villa - Architecture', 2, false),
('prop-005', 'https://images.unsplash.com/photo-1767900009999-b60bcbaffb81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw3fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080', 'Sunset Ridge Villa - Evening View', 3, false);

-- 为其他房源添加默认图片
INSERT INTO public.property_images (property_id, image_url, alt_text, sort_order, is_main)
SELECT 
    p.id,
    'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    p.title_en || ' - Main View',
    1,
    true
FROM public.properties_final_2026_02_21_17_30 p
WHERE p.id NOT IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
AND NOT EXISTS (
    SELECT 1 FROM public.property_images pi WHERE pi.property_id = p.id
);