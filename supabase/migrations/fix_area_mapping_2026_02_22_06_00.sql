-- 检查区域表数据
SELECT * FROM public.property_areas_final_2026_02_21_17_30;

-- 检查房产的area_id
SELECT id, area_id FROM public.properties_final_2026_02_21_17_30 LIMIT 10;

-- 更新房产的area_id，确保正确映射
UPDATE public.properties_final_2026_02_21_17_30 
SET area_id = CASE 
  WHEN id IN ('prop-001', 'prop-002', 'prop-003') THEN 'canggu'
  WHEN id IN ('prop-004', 'prop-005', 'prop-006') THEN 'seminyak'
  WHEN id IN ('prop-007', 'prop-008', 'prop-009') THEN 'ubud'
  WHEN id IN ('prop-010', 'prop-011', 'prop-012') THEN 'uluwatu'
  WHEN id IN ('prop-013', 'prop-014', 'prop-015') THEN 'sanur'
  ELSE 'canggu'
END;