-- 检查数据库连接和数据完整性
SELECT 'Database connection test' as status;

-- 检查房产表数据
SELECT COUNT(*) as property_count FROM public.properties_final_2026_02_21_17_30;

-- 检查土地形式表数据
SELECT COUNT(*) as land_zone_count FROM public.land_zones_2026_02_22_06_00;

-- 检查房产图片数据
SELECT COUNT(*) as image_count FROM public.property_images_final_2026_02_21_17_30;

-- 检查外键关联
SELECT 
  p.id,
  p.title,
  p.land_zone_id,
  lz.name_en,
  lz.name_zh
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.land_zones_2026_02_22_06_00 lz ON p.land_zone_id = lz.id
LIMIT 5;