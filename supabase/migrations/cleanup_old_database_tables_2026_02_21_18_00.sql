-- 删除所有旧的数据库表，只保留最终版本

-- 首先查看当前所有表
SELECT 
  table_name,
  CASE 
    WHEN table_name LIKE '%final_2026_02_21_17_30%' THEN 'KEEP - Final Version'
    WHEN table_name LIKE '%optimized_2026_02_21_17_00%' THEN 'DELETE - Old Version'
    ELSE 'OTHER'
  END as action
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%property%'
ORDER BY table_name;

-- 删除旧的优化版本表（按依赖关系顺序删除）
DROP TABLE IF EXISTS public.property_views_optimized_2026_02_21_17_00 CASCADE;
DROP TABLE IF EXISTS public.property_inquiries_optimized_2026_02_21_17_00 CASCADE;
DROP TABLE IF EXISTS public.property_amenity_relations_optimized_2026_02_21_17_00 CASCADE;
DROP TABLE IF EXISTS public.property_images_optimized_2026_02_21_17_00 CASCADE;
DROP TABLE IF EXISTS public.properties_optimized_2026_02_21_17_00 CASCADE;
DROP TABLE IF EXISTS public.property_amenities_optimized_2026_02_21_17_00 CASCADE;
DROP TABLE IF EXISTS public.property_types_optimized_2026_02_21_17_00 CASCADE;
DROP TABLE IF EXISTS public.property_areas_optimized_2026_02_21_17_00 CASCADE;

-- 验证删除结果
SELECT 
  'Database Cleanup Complete' as status,
  COUNT(*) as remaining_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%property%'
  AND table_name NOT LIKE '%final_2026_02_21_17_30%';

-- 查看保留的最终版本表
SELECT 
  table_name,
  'Final Version - ACTIVE' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%final_2026_02_21_17_30%'
ORDER BY table_name;