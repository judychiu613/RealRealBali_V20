-- 修复数据类型转换的迁移脚本

-- 1. 迁移区域数据
INSERT INTO public.property_areas_optimized_2026_02_21_17_00 (
  slug, name_en, name_zh, description_en, description_zh, sort_order
)
SELECT 
  slug, name_en, name_zh, description_en, description_zh, sort_order
FROM public.property_areas_2026_02_21_08_00
ON CONFLICT (slug) DO NOTHING;

-- 2. 迁移房产类型数据
INSERT INTO public.property_types_optimized_2026_02_21_17_00 (
  slug, name_en, name_zh, description_en, description_zh, sort_order
)
SELECT 
  slug, name_en, name_zh, description_en, description_zh, sort_order
FROM public.property_types_2026_02_21_08_00
ON CONFLICT (slug) DO NOTHING;

-- 3. 迁移房产数据 - 处理数据类型转换
INSERT INTO public.properties_optimized_2026_02_21_17_00 (
  id, title_en, title_zh, description_en, description_zh, price_usd,
  bedrooms, bathrooms, building_area, land_area, 
  area_id, type_id, status, ownership, 
  latitude, longitude, 
  tags_zh, -- 处理JSONB到TEXT[]的转换
  is_featured, is_published, created_at, updated_at
)
SELECT 
  p.slug, -- 使用slug作为新的id
  p.title_en, p.title_zh, p.description_en, p.description_zh, p.price_usd,
  p.bedrooms, p.bathrooms, p.building_area, p.land_area,
  p.area_id, p.type_id, p.status, p.ownership,
  p.latitude, p.longitude,
  -- 将JSONB转换为TEXT[]
  CASE 
    WHEN p.tags_zh IS NOT NULL THEN 
      ARRAY(SELECT jsonb_array_elements_text(p.tags_zh))
    ELSE 
      ARRAY[]::TEXT[]
  END,
  p.is_featured, p.is_published, p.created_at, p.updated_at
FROM public.properties_2026_02_21_08_00 p
ON CONFLICT (id) DO NOTHING;

-- 4. 迁移房产图片数据
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
  name_en, name_zh, icon, category, sort_order
)
SELECT 
  name_en, name_zh, icon, category, sort_order
FROM public.property_amenities_2026_02_21_08_00;

-- 验证迁移结果
SELECT 
  'Migration Summary' as check_type,
  (SELECT COUNT(*) FROM public.properties_optimized_2026_02_21_17_00) as properties_count,
  (SELECT COUNT(*) FROM public.property_images_optimized_2026_02_21_17_00) as images_count,
  (SELECT COUNT(*) FROM public.property_areas_optimized_2026_02_21_17_00) as areas_count,
  (SELECT COUNT(*) FROM public.property_types_optimized_2026_02_21_17_00) as types_count,
  (SELECT COUNT(*) FROM public.property_amenities_optimized_2026_02_21_17_00) as amenities_count;

-- 验证房产ID格式和数据
SELECT id, title_zh, is_featured, is_published, tags_zh
FROM public.properties_optimized_2026_02_21_17_00
ORDER BY id
LIMIT 5;