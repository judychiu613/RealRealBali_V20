-- 检查房源的土地形式数据
SELECT 
    id,
    title_zh,
    land_zone_id,
    lz.name_en as land_zone_en,
    lz.name_zh as land_zone_zh
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_land_zones_final_2026_02_21_17_30 lz ON p.land_zone_id = lz.id
WHERE p.id IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
ORDER BY p.id;