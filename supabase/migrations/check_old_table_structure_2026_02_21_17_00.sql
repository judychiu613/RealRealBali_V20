-- 检查旧表结构并修复迁移脚本

-- 1. 检查旧区域表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'property_areas_2026_02_21_08_00' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. 检查旧房产表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties_2026_02_21_08_00' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. 查看一些示例数据
SELECT id, slug, title_zh, is_featured, is_published
FROM public.properties_2026_02_21_08_00
LIMIT 5;