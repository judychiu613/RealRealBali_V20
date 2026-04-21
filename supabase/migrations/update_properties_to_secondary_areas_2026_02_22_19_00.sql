-- 更新房源的area_id从一级区域改为二级区域
-- 为每个一级区域的房源随机分配其下属的二级区域

-- 更新水明漾(seminyak)的房源
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' OR id LIKE '%9' THEN 'seminyak-beach'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'petitenget'
  WHEN id LIKE '%3' OR id LIKE '%7' THEN 'oberoi'
  ELSE 'kayu-aya'
END
WHERE area_id = 'seminyak';

-- 更新仓古(canggu)的房源
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'echo-beach'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'berawa'
  WHEN id LIKE '%3' OR id LIKE '%7' THEN 'batu-bolong'
  ELSE 'pererenan'
END
WHERE area_id = 'canggu';

-- 更新乌布(ubud)的房源
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'ubud-center'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'tegallalang'
  WHEN id LIKE '%3' OR id LIKE '%7' THEN 'mas'
  ELSE 'payangan'
END
WHERE area_id = 'ubud';

-- 更新乌鲁瓦图(uluwatu)的房源
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'bingin'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'padang-padang'
  WHEN id LIKE '%3' OR id LIKE '%7' THEN 'dreamland'
  ELSE 'suluban'
END
WHERE area_id = 'uluwatu';

-- 更新金巴兰(jimbaran)的房源
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'jimbaran-bay'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'kedonganan'
  ELSE 'ungasan'
END
WHERE area_id = 'jimbaran';

-- 更新沙努尔(sanur)的房源
UPDATE public.properties 
SET area_id = CASE 
  WHEN id LIKE '%1' OR id LIKE '%5' THEN 'sanur-beach'
  WHEN id LIKE '%2' OR id LIKE '%6' THEN 'sindhu'
  ELSE 'mertasari'
END
WHERE area_id = 'sanur';