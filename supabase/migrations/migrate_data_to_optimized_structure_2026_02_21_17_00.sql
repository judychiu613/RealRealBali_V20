-- 迁移现有数据到优化的数据库结构

-- 1. 迁移区域数据
INSERT INTO public.property_areas_optimized_2026_02_21_17_00 (
  id, slug, name_en, name_zh, description_en, description_zh, sort_order, is_active
)
SELECT 
  id, slug, name_en, name_zh, description_en, description_zh, sort_order, is_active
FROM public.property_areas_2026_02_21_08_00
ON CONFLICT (id) DO NOTHING;

-- 2. 迁移房产类型数据
INSERT INTO public.property_types_optimized_2026_02_21_17_00 (
  id, slug, name_en, name_zh, description_en, description_zh, sort_order, is_active
)
SELECT 
  id, slug, name_en, name_zh, description_en, description_zh, sort_order, is_active
FROM public.property_types_2026_02_21_08_00
ON CONFLICT (id) DO NOTHING;

-- 3. 迁移房产数据 - 使用slug作为新的主键id
INSERT INTO public.properties_optimized_2026_02_21_17_00 (
  id, title_en, title_zh, description_en, description_zh, price_usd,
  bedrooms, bathrooms, building_area, land_area, area_id, type_id,
  status, ownership, latitude, longitude, tags_en, tags_zh,
  is_featured, is_published, created_at, updated_at
)
SELECT 
  slug, -- 使用slug作为新的id
  title_en, title_zh, description_en, description_zh, price_usd,
  bedrooms, bathrooms, building_area, land_area, area_id, type_id,
  status, ownership, latitude, longitude, tags_en, tags_zh,
  is_featured, is_published, created_at, updated_at
FROM public.properties_2026_02_21_08_00
ON CONFLICT (id) DO NOTHING;

-- 4. 迁移房产图片数据 - 使用房产的slug作为property_id
INSERT INTO public.property_images_optimized_2026_02_21_17_00 (
  property_id, image_url, image_type, is_primary, sort_order, created_at
)
SELECT 
  p.slug, -- 使用房产的slug作为property_id
  pi.image_url, pi.image_type, pi.is_primary, pi.sort_order, pi.created_at
FROM public.property_images_2026_02_21_08_00 pi
JOIN public.properties_2026_02_21_08_00 p ON p.id = pi.property_id;

-- 5. 迁移设施数据
INSERT INTO public.property_amenities_optimized_2026_02_21_17_00 (
  id, name_en, name_zh, icon, category, sort_order, is_active, created_at
)
SELECT 
  id, name_en, name_zh, icon, category, sort_order, is_active, created_at
FROM public.property_amenities_2026_02_21_08_00
ON CONFLICT (id) DO NOTHING;

-- 6. 迁移房产设施关联数据 - 使用房产的slug作为property_id
INSERT INTO public.property_amenity_relations_optimized_2026_02_21_17_00 (
  property_id, amenity_id, created_at
)
SELECT 
  p.slug, -- 使用房产的slug作为property_id
  par.amenity_id, par.created_at
FROM public.property_amenity_relations_2026_02_21_08_00 par
JOIN public.properties_2026_02_21_08_00 p ON p.id = par.property_id
ON CONFLICT (property_id, amenity_id) DO NOTHING;

-- 7. 迁移询盘数据 - 使用房产的slug作为property_id
INSERT INTO public.property_inquiries_optimized_2026_02_21_17_00 (
  property_id, user_id, name, email, phone, message, inquiry_type, status, created_at, updated_at
)
SELECT 
  p.slug, -- 使用房产的slug作为property_id
  pi.user_id, pi.name, pi.email, pi.phone, pi.message, pi.inquiry_type, pi.status, pi.created_at, pi.updated_at
FROM public.property_inquiries_2026_02_21_08_00 pi
JOIN public.properties_2026_02_21_08_00 p ON p.id = pi.property_id;

-- 8. 迁移浏览记录数据 - 使用房产的slug作为property_id
INSERT INTO public.property_views_optimized_2026_02_21_17_00 (
  property_id, user_id, ip_address, user_agent, viewed_at
)
SELECT 
  p.slug, -- 使用房产的slug作为property_id
  pv.user_id, pv.ip_address, pv.user_agent, pv.viewed_at
FROM public.property_views_2026_02_21_08_00 pv
JOIN public.properties_2026_02_21_08_00 p ON p.id = pv.property_id;

-- 验证迁移结果
SELECT 
  'Migration Summary' as check_type,
  (SELECT COUNT(*) FROM public.properties_optimized_2026_02_21_17_00) as properties_count,
  (SELECT COUNT(*) FROM public.property_images_optimized_2026_02_21_17_00) as images_count,
  (SELECT COUNT(*) FROM public.property_areas_optimized_2026_02_21_17_00) as areas_count,
  (SELECT COUNT(*) FROM public.property_types_optimized_2026_02_21_17_00) as types_count,
  (SELECT COUNT(*) FROM public.property_amenities_optimized_2026_02_21_17_00) as amenities_count;