-- 处理剩余的仓古房源（如果echo-beach不存在，尝试其他选项）
UPDATE public.properties 
SET area_id = 'berawa'
WHERE area_id = 'canggu';

-- 处理剩余的乌布房源
UPDATE public.properties 
SET area_id = 'tegallalang'
WHERE area_id = 'ubud';

-- 处理剩余的乌鲁瓦图房源
UPDATE public.properties 
SET area_id = 'padang-padang'
WHERE area_id = 'uluwatu';

-- 处理剩余的金巴兰房源
UPDATE public.properties 
SET area_id = 'kedonganan'
WHERE area_id = 'jimbaran';

-- 处理剩余的沙努尔房源
UPDATE public.properties 
SET area_id = 'sindhu'
WHERE area_id = 'sanur';

-- 最终验证：查看所有房源的area_id分布
SELECT 
  area_id,
  COUNT(*) as property_count,
  type_id,
  CASE 
    WHEN area_id IN ('seminyak', 'canggu', 'ubud', 'uluwatu', 'jimbaran', 'sanur') THEN '一级区域'
    ELSE '二级区域'
  END as area_level
FROM public.properties 
GROUP BY area_id, type_id
ORDER BY area_level, area_id, type_id;

-- 确认没有剩余的一级区域
SELECT COUNT(*) as remaining_primary_areas
FROM public.properties 
WHERE area_id IN ('seminyak', 'canggu', 'ubud', 'uluwatu', 'jimbaran', 'sanur');