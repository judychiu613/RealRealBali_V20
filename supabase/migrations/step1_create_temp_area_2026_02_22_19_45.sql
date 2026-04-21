-- 第一步：创建临时区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('temp_area', '临时区域', 'Temporary Area', NULL);

-- 查看当前房源使用的区域
SELECT DISTINCT area_id, COUNT(*) as count FROM public.properties GROUP BY area_id ORDER BY area_id;

-- 将所有房源临时迁移到新的对应区域
-- 根据现有的区域ID映射到新的区域结构

-- 水明漾相关 -> seminyak (west-coast)
UPDATE public.properties SET area_id = 'temp_area' 
WHERE area_id IN ('seminyak-beach', 'petitenget', 'oberoi', 'kayu-aya', 'seminyak');

-- 仓古相关 -> canggu (west-coast)  
UPDATE public.properties SET area_id = 'temp_area'
WHERE area_id IN ('echo-beach', 'berawa', 'batu-bolong', 'pererenan', 'canggu');

-- 乌布相关 -> ubud-center (ubud-central)
UPDATE public.properties SET area_id = 'temp_area'
WHERE area_id IN ('ubud-center', 'tegallalang', 'mas', 'payangan', 'ubud');

-- 乌鲁瓦图相关 -> uluwatu (south-bukit)
UPDATE public.properties SET area_id = 'temp_area'
WHERE area_id IN ('bingin', 'padang-padang', 'dreamland', 'suluban', 'uluwatu');

-- 金巴兰相关 -> jimbaran (south-bukit)
UPDATE public.properties SET area_id = 'temp_area'
WHERE area_id IN ('jimbaran-bay', 'kedonganan', 'ungasan', 'jimbaran');

-- 沙努尔相关 -> 暂时放到west-coast的seminyak
UPDATE public.properties SET area_id = 'temp_area'
WHERE area_id IN ('sanur-beach', 'sindhu', 'mertasari', 'sanur');

-- 其他区域
UPDATE public.properties SET area_id = 'temp_area'
WHERE area_id NOT IN ('temp_area');

-- 验证迁移结果
SELECT area_id, COUNT(*) FROM public.properties GROUP BY area_id;