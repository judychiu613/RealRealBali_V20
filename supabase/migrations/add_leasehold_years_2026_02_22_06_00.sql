-- 添加leasehold_years字段
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD COLUMN IF NOT EXISTS leasehold_years INTEGER;

-- 为所有leasehold房产设置年限
UPDATE public.properties_final_2026_02_21_17_30 
SET leasehold_years = CASE 
  WHEN id IN ('prop-001', 'prop-003', 'prop-004', 'prop-006', 'prop-009') THEN 25
  WHEN id IN ('prop-007', 'prop-011', 'prop-013', 'prop-015') THEN 30
  WHEN id IN ('prop-012', 'prop-014', 'prop-016', 'prop-018') THEN 20
  ELSE NULL
END
WHERE ownership = 'leasehold';

-- 检查更新结果
SELECT id, ownership, leasehold_years FROM public.properties_final_2026_02_21_17_30 
WHERE ownership = 'leasehold' 
LIMIT 10;