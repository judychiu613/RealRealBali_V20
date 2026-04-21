-- 更新房产表的外键关系并修复数据

-- 首先删除旧的外键约束
ALTER TABLE public.properties_final_2026_02_21_17_30 
DROP CONSTRAINT IF EXISTS properties_final_2026_02_21_17_30_type_id_fkey;

-- 添加新的外键约束
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD CONSTRAINT properties_final_2026_02_21_17_30_type_id_fkey 
FOREIGN KEY (type_id) REFERENCES public.property_types_final_2026_02_21_17_30(id);

-- 更新现有房产的type_id，使其指向新的房产类型表
UPDATE public.properties_final_2026_02_21_17_30 
SET type_id = (
  SELECT id FROM public.property_types_final_2026_02_21_17_30 
  WHERE slug = 'luxury-villa' 
  LIMIT 1
)
WHERE id IN ('prop-001', 'prop-005', 'prop-008', 'prop-009', 'prop-015');

UPDATE public.properties_final_2026_02_21_17_30 
SET type_id = (
  SELECT id FROM public.property_types_final_2026_02_21_17_30 
  WHERE slug = 'beachfront-villa' 
  LIMIT 1
)
WHERE id IN ('prop-002', 'prop-011');

UPDATE public.properties_final_2026_02_21_17_30 
SET type_id = (
  SELECT id FROM public.property_types_final_2026_02_21_17_30 
  WHERE slug = 'eco-villa' 
  LIMIT 1
)
WHERE id IN ('prop-003', 'prop-010', 'prop-014');

UPDATE public.properties_final_2026_02_21_17_30 
SET type_id = (
  SELECT id FROM public.property_types_final_2026_02_21_17_30 
  WHERE slug = 'modern-villa' 
  LIMIT 1
)
WHERE id IN ('prop-004', 'prop-007', 'prop-013');

UPDATE public.properties_final_2026_02_21_17_30 
SET type_id = (
  SELECT id FROM public.property_types_final_2026_02_21_17_30 
  WHERE slug = 'tropical-villa' 
  LIMIT 1
)
WHERE id IN ('prop-006', 'prop-012');

-- 验证更新结果
SELECT 
  p.id,
  p.title_zh,
  pt.name_zh as type_name,
  pt.slug as type_slug
FROM public.properties_final_2026_02_21_17_30 p
JOIN public.property_types_final_2026_02_21_17_30 pt ON p.type_id = pt.id
ORDER BY p.id;