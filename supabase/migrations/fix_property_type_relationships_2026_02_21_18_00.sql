-- 检查当前数据状态并修复外键关系

-- 1. 查看当前房产表的type_id
SELECT 
  id,
  title_zh,
  type_id,
  'Current type_id' as status
FROM public.properties_final_2026_02_21_17_30
ORDER BY id
LIMIT 5;

-- 2. 查看新创建的房产类型表
SELECT 
  id,
  name_zh,
  slug,
  'New property types' as status
FROM public.property_types_final_2026_02_21_17_30
ORDER BY sort_order;

-- 3. 临时删除外键约束以便更新数据
ALTER TABLE public.properties_final_2026_02_21_17_30 
DROP CONSTRAINT IF EXISTS properties_final_2026_02_21_17_30_type_id_fkey;

-- 4. 更新所有房产的type_id为新的房产类型ID
UPDATE public.properties_final_2026_02_21_17_30 
SET type_id = (
  SELECT id FROM public.property_types_final_2026_02_21_17_30 
  WHERE slug = 'luxury-villa' 
  LIMIT 1
);

-- 5. 重新添加外键约束
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD CONSTRAINT properties_final_2026_02_21_17_30_type_id_fkey 
FOREIGN KEY (type_id) REFERENCES public.property_types_final_2026_02_21_17_30(id);

-- 6. 验证修复结果
SELECT 
  p.id,
  p.title_zh,
  pt.name_zh as type_name,
  pt.slug as type_slug,
  'Updated successfully' as status
FROM public.properties_final_2026_02_21_17_30 p
JOIN public.property_types_final_2026_02_21_17_30 pt ON p.type_id = pt.id
ORDER BY p.id
LIMIT 5;