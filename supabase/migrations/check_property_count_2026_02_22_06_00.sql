-- 检查房产数据是否存在
SELECT COUNT(*) as total_properties FROM public.properties_final_2026_02_21_17_30;

-- 检查精选房产数据
SELECT COUNT(*) as featured_properties FROM public.properties_final_2026_02_21_17_30 WHERE is_featured = true;

-- 检查前几条房产数据
SELECT id, is_featured, land_zone_id FROM public.properties_final_2026_02_21_17_30 LIMIT 5;