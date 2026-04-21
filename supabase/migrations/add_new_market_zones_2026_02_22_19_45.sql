-- 添加新的一级分类（市场分区）
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'west-coast', '西海岸核心区', 'West Coast', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'west-coast');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'south-bukit', '南部悬崖区', 'South Bukit', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'south-bukit');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'ubud-central', '乌布及中部区域', 'Ubud & Central Bali', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'ubud-central');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'emerging-west', '西部新兴增长区', 'Emerging West', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'emerging-west');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'east-bali', '东巴厘岛', 'East Bali', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'east-bali');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'north-bali', '北巴厘岛', 'North Bali', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'north-bali');

-- 查看添加结果
SELECT id, name_zh, name_en, parent_id FROM public.property_areas_map 
WHERE parent_id IS NULL
ORDER BY id;