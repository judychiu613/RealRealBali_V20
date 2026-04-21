-- South Bukit – 南部悬崖区的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'pecatu', '佩卡图', 'Pecatu', 'south-bukit'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'pecatu');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'nusa-dua', '努沙杜瓦', 'Nusa Dua', 'south-bukit'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'nusa-dua');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'benoa', '贝诺阿', 'Benoa', 'south-bukit'
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'benoa');

-- 更新现有的区域到South Bukit
UPDATE public.property_areas_map SET parent_id = 'south-bukit' WHERE id = 'uluwatu';
UPDATE public.property_areas_map SET parent_id = 'south-bukit' WHERE id = 'bingin';
UPDATE public.property_areas_map SET parent_id = 'south-bukit' WHERE id = 'ungasan';
UPDATE public.property_areas_map SET parent_id = 'south-bukit' WHERE id = 'jimbaran';

-- 查看South Bukit区域
SELECT id, name_zh, name_en, parent_id FROM public.property_areas_map 
WHERE parent_id = 'south-bukit'
ORDER BY id;