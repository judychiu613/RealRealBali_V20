-- 检查房源表中的土地形式字段
SELECT 
    id,
    title_zh,
    land_zone_id
FROM public.properties_final_2026_02_21_17_30 
WHERE id IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
ORDER BY id;

-- 检查land_zone_id的唯一值
SELECT DISTINCT land_zone_id, COUNT(*) as count
FROM public.properties_final_2026_02_21_17_30 
GROUP BY land_zone_id
ORDER BY land_zone_id;