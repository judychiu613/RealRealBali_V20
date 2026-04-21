-- 查看现有的所有区域
SELECT id, name_zh, name_en, parent_id FROM public.property_areas_map ORDER BY id;

-- West Coast – 西海岸核心区的二级区域（避免重复）
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'seseh', '塞塞', 'Seseh', 'west-coast'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'seseh');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'cemagi', '切马吉', 'Cemagi', 'west-coast'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'cemagi');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'kerobokan', '克罗柏坎', 'Kerobokan', 'west-coast'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'kerobokan');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'kuta', '库塔', 'Kuta', 'west-coast'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'kuta');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'legian', '雷吉安', 'Legian', 'west-coast'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'legian');

-- 更新现有的区域到新的父级
UPDATE public.property_areas_map SET parent_id = 'west-coast' WHERE id = 'canggu';
UPDATE public.property_areas_map SET parent_id = 'west-coast' WHERE id = 'pererenan';
UPDATE public.property_areas_map SET parent_id = 'west-coast' WHERE id = 'seminyak';