-- 检查并补充缺失的区域数据

-- 1. 查看当前区域数据
SELECT 
  id,
  name_zh,
  name_en,
  level,
  parent_id
FROM public.property_areas_final_2026_02_21_17_30
ORDER BY level, sort_order;

-- 2. 检查房产表中使用的区域ID
SELECT DISTINCT 
  area_id,
  COUNT(*) as property_count
FROM public.properties_final_2026_02_21_17_30
GROUP BY area_id
ORDER BY area_id;

-- 3. 补充缺失的区域数据
INSERT INTO public.property_areas_final_2026_02_21_17_30 (
  id, name_zh, name_en, description_zh, description_en, 
  level, parent_id, sort_order, is_active
) VALUES 
-- 一级区域
('jimbaran', '金巴兰', 'Jimbaran', '著名的海滩度假区，以日落和海鲜闻名', 'Famous beach resort area known for sunsets and seafood', 1, NULL, 6, true),
('nusa-dua', '努沙杜瓦', 'Nusa Dua', '高端度假区，拥有豪华酒店和高尔夫球场', 'Upscale resort area with luxury hotels and golf courses', 1, NULL, 7, true),
('sanur', '萨努尔', 'Sanur', '宁静的海滩小镇，适合家庭度假', 'Peaceful beach town perfect for family vacations', 1, NULL, 8, true)
ON CONFLICT (id) DO NOTHING;

-- 4. 验证区域数据完整性
SELECT 
  'Area Data Completeness' as check_type,
  COUNT(*) as total_areas,
  COUNT(CASE WHEN level = 1 THEN 1 END) as level_1_areas,
  COUNT(CASE WHEN level = 2 THEN 1 END) as level_2_areas
FROM public.property_areas_final_2026_02_21_17_30;

-- 5. 检查房产和区域的关联
SELECT 
  p.id,
  p.area_id,
  a.name_zh as area_name,
  CASE WHEN a.id IS NULL THEN 'MISSING AREA' ELSE 'OK' END as status
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_areas_final_2026_02_21_17_30 a ON p.area_id = a.id
ORDER BY p.id;