-- 重置所有房产为非精选
UPDATE public.properties_final_2026_02_21_17_30 
SET is_featured = false 
WHERE is_published = true;

-- 只设置前6个房产为精选
UPDATE public.properties_final_2026_02_21_17_30 
SET is_featured = true 
WHERE id IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005', 'prop-006')
AND is_published = true;

-- 验证结果
SELECT 
  id,
  title_zh,
  is_featured
FROM public.properties_final_2026_02_21_17_30
WHERE is_published = true
ORDER BY is_featured DESC, id;