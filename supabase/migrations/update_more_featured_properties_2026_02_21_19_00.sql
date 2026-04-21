-- 将更多房产标记为精选，确保有足够数据进行分页测试
UPDATE public.properties_final_2026_02_21_17_30 
SET is_featured = true 
WHERE id IN ('prop-009', 'prop-010', 'prop-011', 'prop-012', 'prop-013', 'prop-014', 'prop-015')
AND is_published = true;

-- 验证更新结果
SELECT 
  COUNT(*) as total_featured
FROM public.properties_final_2026_02_21_17_30
WHERE is_featured = true AND is_published = true;