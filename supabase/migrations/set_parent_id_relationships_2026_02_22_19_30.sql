-- 首先插入缺失的一级区域（如果不存在）
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'seminyak', '水明漾', 'Seminyak', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'seminyak');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'canggu', '仓古', 'Canggu', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'canggu');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'ubud', '乌布', 'Ubud', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'ubud');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'uluwatu', '乌鲁瓦图', 'Uluwatu', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'uluwatu');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'jimbaran', '金巴兰', 'Jimbaran', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'jimbaran');

INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) 
SELECT 'sanur', '沙努尔', 'Sanur', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.property_areas_map WHERE id = 'sanur');

-- 为现有的二级区域设置parent_id
-- 水明漾的二级区域
UPDATE public.property_areas_map SET parent_id = 'seminyak' 
WHERE id IN ('seminyak-beach', 'petitenget', 'oberoi', 'kayu-aya');

-- 仓古的二级区域
UPDATE public.property_areas_map SET parent_id = 'canggu' 
WHERE id IN ('echo-beach', 'berawa', 'batu-bolong', 'pererenan');

-- 乌布的二级区域
UPDATE public.property_areas_map SET parent_id = 'ubud' 
WHERE id IN ('ubud-center', 'tegallalang', 'mas', 'payangan');

-- 乌鲁瓦图的二级区域
UPDATE public.property_areas_map SET parent_id = 'uluwatu' 
WHERE id IN ('bingin', 'padang-padang', 'dreamland', 'suluban');

-- 金巴兰的二级区域
UPDATE public.property_areas_map SET parent_id = 'jimbaran' 
WHERE id IN ('jimbaran-bay', 'kedonganan', 'ungasan');

-- 沙努尔的二级区域
UPDATE public.property_areas_map SET parent_id = 'sanur' 
WHERE id IN ('sanur-beach', 'sindhu', 'mertasari');

-- 查看更新后的结果
SELECT 
  id,
  name_zh,
  name_en,
  parent_id,
  CASE 
    WHEN parent_id IS NULL THEN '一级区域'
    ELSE '二级区域'
  END as level
FROM public.property_areas_map 
ORDER BY parent_id NULLS FIRST, id;