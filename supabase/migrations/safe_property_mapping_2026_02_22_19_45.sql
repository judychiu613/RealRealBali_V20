-- 查看当前所有可用的区域ID
SELECT id, name_zh, parent_id FROM public.property_areas_map WHERE parent_id IS NOT NULL ORDER BY id;

-- 查看当前房源使用的区域
SELECT DISTINCT area_id FROM public.properties ORDER BY area_id;

-- 简单映射：将所有房源分配到主要的新区域
-- 使用简单的随机分配策略

-- 将所有房源临时映射到主要区域
UPDATE public.properties SET area_id = 'seminyak' WHERE area_id IN ('seminyak-beach', 'petitenget', 'oberoi', 'kayu-aya', 'seminyak');
UPDATE public.properties SET area_id = 'canggu' WHERE area_id IN ('echo-beach', 'berawa', 'batu-bolong', 'canggu');
UPDATE public.properties SET area_id = 'ubud-center' WHERE area_id IN ('ubud-center', 'mas', 'payangan', 'ubud');
UPDATE public.properties SET area_id = 'uluwatu' WHERE area_id IN ('bingin', 'padang-padang', 'dreamland', 'suluban', 'uluwatu');
UPDATE public.properties SET area_id = 'jimbaran' WHERE area_id IN ('jimbaran-bay', 'kedonganan', 'jimbaran');
UPDATE public.properties SET area_id = 'kedungu' WHERE area_id IN ('sanur-beach', 'sindhu', 'mertasari', 'sanur');

-- 处理tegallalang区域（如果存在）
UPDATE public.properties SET area_id = 'ubud-center' WHERE area_id = 'tegallalang';

-- 验证更新结果
SELECT area_id, COUNT(*) as count FROM public.properties GROUP BY area_id ORDER BY area_id;