-- 修复精选房产数量问题
-- 1. 首先查看当前精选房产的数量和分布
SELECT 
  'Current Featured Properties' as status,
  COUNT(*) as count
FROM public.properties_2026_02_21_08_00
WHERE is_featured = true AND is_published = true;

-- 2. 查看所有精选房产的详细信息
SELECT 
  slug,
  title_zh,
  price_usd,
  is_featured,
  is_published,
  created_at
FROM public.properties_2026_02_21_08_00
WHERE is_featured = true
ORDER BY created_at DESC;

-- 3. 将更多房产设置为精选（确保有足够的精选房产）
-- 选择价格较高、不同区域的房产作为精选
UPDATE public.properties_2026_02_21_08_00 
SET is_featured = true 
WHERE slug IN (
  'prop-006', 'prop-007', 'prop-008', 'prop-009', 'prop-010',
  'prop-011', 'prop-012', 'prop-013', 'prop-014', 'prop-015',
  'prop-016', 'prop-017', 'prop-018', 'prop-019', 'prop-020',
  'prop-021', 'prop-022', 'prop-023', 'prop-025', 'prop-026',
  'prop-028', 'prop-030', 'prop-032', 'prop-034', 'prop-035',
  'prop-037', 'prop-039', 'prop-041', 'prop-043', 'prop-045',
  'prop-047', 'prop-049'
);

-- 4. 验证更新后的精选房产数量
SELECT 
  'Updated Featured Properties' as status,
  COUNT(*) as count
FROM public.properties_2026_02_21_08_00
WHERE is_featured = true AND is_published = true;