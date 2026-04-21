-- 分步骤迁移数据，先处理外键依赖

-- 步骤1: 先迁移区域数据，保持原有的UUID
INSERT INTO public.property_areas_optimized_2026_02_21_17_00 (
  id, slug, name_en, name_zh, description_en, description_zh, sort_order
)
SELECT 
  id, slug, name_en, name_zh, description_en, description_zh, sort_order
FROM public.property_areas_2026_02_21_08_00
ON CONFLICT (id) DO NOTHING;

-- 步骤2: 迁移房产类型数据，保持原有的UUID
INSERT INTO public.property_types_optimized_2026_02_21_17_00 (
  id, slug, name_en, name_zh, description_en, description_zh, sort_order
)
SELECT 
  id, slug, name_en, name_zh, description_en, description_zh, sort_order
FROM public.property_types_2026_02_21_08_00
ON CONFLICT (id) DO NOTHING;

-- 验证外键表已迁移
SELECT 
  'Foreign Key Tables' as check_type,
  (SELECT COUNT(*) FROM public.property_areas_optimized_2026_02_21_17_00) as areas_count,
  (SELECT COUNT(*) FROM public.property_types_optimized_2026_02_21_17_00) as types_count;