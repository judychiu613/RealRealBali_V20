-- 迁移数据到新表格

-- 1. 迁移房源类型数据
INSERT INTO public.property_types (id, name_en, name_zh, sort_order)
SELECT id, name_en, name_zh, 1
FROM public.property_types_final_2026_02_22_09_30
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    updated_at = now();

-- 2. 迁移房源区域数据
INSERT INTO public.property_areas (id, name_en, name_zh, sort_order)
SELECT id, name_en, name_zh, 1
FROM public.property_areas_final_2026_02_21_17_30
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    updated_at = now();

-- 3. 迁移土地形式数据
INSERT INTO public.land_zones (id, name_en, name_zh, sort_order)
SELECT id, name_en, name_zh, 1
FROM public.land_zones_2026_02_22_06_00
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    updated_at = now();

-- 4. 迁移房源主数据
INSERT INTO public.properties (
    id, title_en, title_zh, description_en, description_zh,
    price_usd, price_cny, price_idr,
    bedrooms, bathrooms, building_area, land_area,
    area_id, type_id, status, ownership,
    latitude, longitude,
    tags_en, tags_zh, amenities_en, amenities_zh,
    is_featured, is_published, build_year, land_zone_id, leasehold_years,
    created_at, updated_at
)
SELECT 
    id, title_en, title_zh, description_en, description_zh,
    price_usd, price_cny, price_idr,
    bedrooms, bathrooms, building_area, land_area,
    area_id, type_id, status, ownership,
    latitude, longitude,
    tags_en, tags_zh, amenities_en, amenities_zh,
    is_featured, is_published, build_year, land_zone_id, leasehold_years,
    created_at, updated_at
FROM public.properties_final_2026_02_21_17_30
ON CONFLICT (id) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_zh = EXCLUDED.title_zh,
    description_en = EXCLUDED.description_en,
    description_zh = EXCLUDED.description_zh,
    price_usd = EXCLUDED.price_usd,
    price_cny = EXCLUDED.price_cny,
    price_idr = EXCLUDED.price_idr,
    bedrooms = EXCLUDED.bedrooms,
    bathrooms = EXCLUDED.bathrooms,
    building_area = EXCLUDED.building_area,
    land_area = EXCLUDED.land_area,
    area_id = EXCLUDED.area_id,
    type_id = EXCLUDED.type_id,
    status = EXCLUDED.status,
    ownership = EXCLUDED.ownership,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    tags_en = EXCLUDED.tags_en,
    tags_zh = EXCLUDED.tags_zh,
    amenities_en = EXCLUDED.amenities_en,
    amenities_zh = EXCLUDED.amenities_zh,
    is_featured = EXCLUDED.is_featured,
    is_published = EXCLUDED.is_published,
    build_year = EXCLUDED.build_year,
    land_zone_id = EXCLUDED.land_zone_id,
    leasehold_years = EXCLUDED.leasehold_years,
    updated_at = now();

-- 5. 迁移房源图片数据
INSERT INTO public.property_images (property_id, image_url, sort_order, created_at, updated_at)
SELECT property_id, image_url, sort_order, 
       COALESCE(created_at, now()), 
       COALESCE(updated_at, now())
FROM public.property_images
WHERE property_id IN (SELECT id FROM public.properties)
ON CONFLICT DO NOTHING;

-- 6. 迁移用户收藏数据（如果存在）
INSERT INTO public.user_favorites_map (user_id, property_id, created_at)
SELECT user_id, property_id, created_at
FROM public.user_favorites
WHERE property_id IN (SELECT id FROM public.properties)
ON CONFLICT (user_id, property_id) DO NOTHING;

-- 验证数据迁移
SELECT 
    'property_types' as table_name, COUNT(*) as count FROM public.property_types
UNION ALL
SELECT 
    'property_areas' as table_name, COUNT(*) as count FROM public.property_areas
UNION ALL
SELECT 
    'land_zones' as table_name, COUNT(*) as count FROM public.land_zones
UNION ALL
SELECT 
    'properties' as table_name, COUNT(*) as count FROM public.properties
UNION ALL
SELECT 
    'property_images' as table_name, COUNT(*) as count FROM public.property_images
UNION ALL
SELECT 
    'user_favorites_map' as table_name, COUNT(*) as count FROM public.user_favorites_map;