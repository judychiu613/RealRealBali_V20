-- 检查现有土地形式数据
SELECT * FROM public.land_zones_2026_02_22_06_00 ORDER BY id;

-- 更新部分房源的土地形式，提供更多样性
UPDATE public.properties_final_2026_02_21_17_30 
SET land_zone_id = CASE 
    WHEN id IN ('prop-001', 'prop-003') THEN 'pinkzone'     -- 保持旅游用地
    WHEN id IN ('prop-002', 'prop-004') THEN 'yellowzone'   -- 黄色区域
    WHEN id IN ('prop-005', 'prop-006') THEN 'greenzone'    -- 绿色区域
    WHEN id IN ('prop-007', 'prop-008') THEN 'redzone'      -- 红色区域
    WHEN id IN ('prop-009', 'prop-010') THEN 'bluezone'     -- 蓝色区域
    ELSE 'pinkzone'  -- 默认旅游用地
END;

-- 验证更新结果
SELECT 
    p.id,
    p.title_zh,
    p.land_zone_id,
    lz.name_zh as land_zone_name
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.land_zones_2026_02_22_06_00 lz ON p.land_zone_id = lz.id
WHERE p.id IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
ORDER BY p.id;