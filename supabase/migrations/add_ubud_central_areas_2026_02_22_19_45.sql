-- Ubud & Central Bali – 乌布及中部区域的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'sayan', '萨彦', 'Sayan', 'ubud-central'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'sayan');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'pejeng', '佩姜', 'Pejeng', 'ubud-central'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'pejeng');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'lodtunduh', '洛顿图', 'Lodtunduh', 'ubud-central'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'lodtunduh');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'tampaksiring', '坦帕克西林', 'Tampaksiring', 'ubud-central'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'tampaksiring');

-- 更新现有的区域到Ubud Central
UPDATE public.property_areas_map SET parent_id = 'ubud-central' WHERE id = 'ubud-center';
UPDATE public.property_areas_map SET parent_id = 'ubud-central' WHERE id = 'mas';
UPDATE public.property_areas_map SET parent_id = 'ubud-central' WHERE id = 'tegalalang';
UPDATE public.property_areas_map SET parent_id = 'ubud-central' WHERE id = 'payangan';

-- 查看Ubud Central区域
SELECT id, name_zh, name_en, parent_id FROM public.property_areas_map 
WHERE parent_id = 'ubud-central'
ORDER BY id;