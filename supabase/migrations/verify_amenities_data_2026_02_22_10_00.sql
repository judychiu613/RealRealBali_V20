-- 验证特色设施数据
SELECT 
    id,
    title_zh,
    amenities_en,
    amenities_zh
FROM public.properties_final_2026_02_21_17_30 
WHERE id IN ('prop-001', 'prop-004', 'prop-009')
ORDER BY id;