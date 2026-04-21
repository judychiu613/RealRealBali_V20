-- 查看当前房源使用的区域分布
SELECT area_id, COUNT(*) as count FROM public.properties GROUP BY area_id ORDER BY area_id;

-- 智能映射现有房源到新的区域结构
-- 基于房源ID的模式分配到合适的新区域

-- 水明漾相关房源 -> 分配到west-coast下的不同区域
UPDATE public.properties SET area_id = 'seminyak' 
WHERE area_id IN ('seminyak-beach', 'petitenget', 'oberoi', 'kayu-aya', 'seminyak')
AND id % 4 = 0;

UPDATE public.properties SET area_id = 'kerobokan' 
WHERE area_id IN ('seminyak-beach', 'petitenget', 'oberoi', 'kayu-aya', 'seminyak')
AND id % 4 = 1;

UPDATE public.properties SET area_id = 'kuta' 
WHERE area_id IN ('seminyak-beach', 'petitenget', 'oberoi', 'kayu-aya', 'seminyak')
AND id % 4 = 2;

UPDATE public.properties SET area_id = 'legian' 
WHERE area_id IN ('seminyak-beach', 'petitenget', 'oberoi', 'kayu-aya', 'seminyak')
AND id % 4 = 3;

-- 仓古相关房源 -> 分配到west-coast下的区域
UPDATE public.properties SET area_id = 'canggu' 
WHERE area_id IN ('echo-beach', 'berawa', 'batu-bolong', 'canggu')
AND id % 3 = 0;

UPDATE public.properties SET area_id = 'pererenan' 
WHERE area_id IN ('echo-beach', 'berawa', 'batu-bolong', 'canggu')
AND id % 3 = 1;

UPDATE public.properties SET area_id = 'seseh' 
WHERE area_id IN ('echo-beach', 'berawa', 'batu-bolong', 'canggu')
AND id % 3 = 2;

-- 乌布相关房源 -> 分配到ubud-central下的区域
UPDATE public.properties SET area_id = 'ubud-center' 
WHERE area_id IN ('ubud-center', 'tegallalang', 'mas', 'payangan', 'ubud')
AND id % 3 = 0;

UPDATE public.properties SET area_id = 'sayan' 
WHERE area_id IN ('ubud-center', 'tegallalang', 'mas', 'payangan', 'ubud')
AND id % 3 = 1;

UPDATE public.properties SET area_id = 'tegalalang' 
WHERE area_id IN ('ubud-center', 'tegallalang', 'mas', 'payangan', 'ubud')
AND id % 3 = 2;

-- 乌鲁瓦图相关房源 -> 分配到south-bukit下的区域
UPDATE public.properties SET area_id = 'uluwatu' 
WHERE area_id IN ('bingin', 'padang-padang', 'dreamland', 'suluban', 'uluwatu')
AND id % 3 = 0;

UPDATE public.properties SET area_id = 'pecatu' 
WHERE area_id IN ('bingin', 'padang-padang', 'dreamland', 'suluban', 'uluwatu')
AND id % 3 = 1;

UPDATE public.properties SET area_id = 'bingin' 
WHERE area_id IN ('bingin', 'padang-padang', 'dreamland', 'suluban', 'uluwatu')
AND id % 3 = 2;

-- 金巴兰相关房源 -> 分配到south-bukit下的区域
UPDATE public.properties SET area_id = 'jimbaran' 
WHERE area_id IN ('jimbaran-bay', 'kedonganan', 'jimbaran')
AND id % 2 = 0;

UPDATE public.properties SET area_id = 'ungasan' 
WHERE area_id IN ('jimbaran-bay', 'kedonganan', 'jimbaran')
AND id % 2 = 1;

-- 沙努尔相关房源 -> 分配到emerging-west（作为新兴区域）
UPDATE public.properties SET area_id = 'kedungu' 
WHERE area_id IN ('sanur-beach', 'sindhu', 'mertasari', 'sanur');

-- 验证更新结果
SELECT area_id, COUNT(*) as count FROM public.properties GROUP BY area_id ORDER BY area_id;