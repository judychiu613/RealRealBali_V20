-- 迁移图片和关联数据

-- 步骤4: 迁移房产图片数据 - 使用房产的slug作为property_id
INSERT INTO public.property_images_optimized_2026_02_21_17_00 (
  property_id, image_url, image_type, is_primary, sort_order, created_at
)
SELECT 
  p.slug, -- 使用房产的slug作为property_id
  pi.image_url, pi.image_type, pi.is_primary, pi.sort_order, pi.created_at
FROM public.property_images_2026_02_21_08_00 pi
JOIN public.properties_2026_02_21_08_00 p ON p.id = pi.property_id;

-- 步骤5: 迁移设施数据
INSERT INTO public.property_amenities_optimized_2026_02_21_17_00 (
  name_en, name_zh, icon, category, sort_order
)
SELECT 
  name_en, name_zh, icon, category, sort_order
FROM public.property_amenities_2026_02_21_08_00;

-- 步骤6: 迁移房产设施关联数据 - 使用房产的slug作为property_id
INSERT INTO public.property_amenity_relations_optimized_2026_02_21_17_00 (
  property_id, amenity_id, created_at
)
SELECT 
  p.slug, -- 使用房产的slug作为property_id
  par.amenity_id, par.created_at
FROM public.property_amenity_relations_2026_02_21_08_00 par
JOIN public.properties_2026_02_21_08_00 p ON p.id = par.property_id
ON CONFLICT (property_id, amenity_id) DO NOTHING;

-- 最终验证迁移结果
SELECT 
  'Final Migration Summary' as check_type,
  (SELECT COUNT(*) FROM public.properties_optimized_2026_02_21_17_00) as properties_count,
  (SELECT COUNT(*) FROM public.property_images_optimized_2026_02_21_17_00) as images_count,
  (SELECT COUNT(*) FROM public.property_areas_optimized_2026_02_21_17_00) as areas_count,
  (SELECT COUNT(*) FROM public.property_types_optimized_2026_02_21_17_00) as types_count,
  (SELECT COUNT(*) FROM public.property_amenities_optimized_2026_02_21_17_00) as amenities_count,
  (SELECT COUNT(*) FROM public.property_amenity_relations_optimized_2026_02_21_17_00) as amenity_relations_count;

-- 验证图片数据关联
SELECT 
  p.id,
  p.title_zh,
  COUNT(pi.id) as image_count,
  COUNT(CASE WHEN pi.is_primary = true THEN 1 END) as primary_images
FROM public.properties_optimized_2026_02_21_17_00 p
LEFT JOIN public.property_images_optimized_2026_02_21_17_00 pi ON p.id = pi.property_id
GROUP BY p.id, p.title_zh
ORDER BY p.id
LIMIT 5;