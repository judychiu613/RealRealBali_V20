-- 删除旧的数据表格，清理数据库

-- 删除旧表（按依赖关系顺序删除）
DROP TABLE IF EXISTS public.property_views_2026_02_21_08_00 CASCADE;
DROP TABLE IF EXISTS public.property_inquiries_2026_02_21_08_00 CASCADE;
DROP TABLE IF EXISTS public.property_amenity_relations_2026_02_21_08_00 CASCADE;
DROP TABLE IF EXISTS public.property_images_2026_02_21_08_00 CASCADE;
DROP TABLE IF EXISTS public.properties_2026_02_21_08_00 CASCADE;
DROP TABLE IF EXISTS public.property_amenities_2026_02_21_08_00 CASCADE;
DROP TABLE IF EXISTS public.property_types_2026_02_21_08_00 CASCADE;
DROP TABLE IF EXISTS public.property_areas_2026_02_21_08_00 CASCADE;

-- 验证删除结果
SELECT 
  'Old Tables Cleanup' as status,
  COUNT(*) as remaining_old_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%2026_02_21_08_00%';

-- 查看当前保留的表
SELECT 
  table_name,
  'Optimized Table' as table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%optimized_2026_02_21_17_00%'
ORDER BY table_name;