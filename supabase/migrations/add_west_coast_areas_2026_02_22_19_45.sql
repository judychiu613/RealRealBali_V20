-- West Coast – 西海岸核心区的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('canggu-new', '苍古', 'Canggu', 'west-coast'),
('pererenan-new', '佩雷雷南', 'Pererenan', 'west-coast'),
('seseh', '塞塞', 'Seseh', 'west-coast'),
('cemagi', '切马吉', 'Cemagi', 'west-coast'),
('kerobokan', '克罗柏坎', 'Kerobokan', 'west-coast'),
('seminyak-new', '水明漾', 'Seminyak', 'west-coast'),
('kuta', '库塔', 'Kuta', 'west-coast'),
('legian', '雷吉安', 'Legian', 'west-coast');

-- 查看West Coast区域
SELECT id, name_zh, name_en, parent_id FROM public.property_areas_map 
WHERE parent_id = 'west-coast'
ORDER BY id;