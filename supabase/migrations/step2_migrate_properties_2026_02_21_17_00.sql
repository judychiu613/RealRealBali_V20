-- 迁移房产主表数据

-- 步骤3: 迁移房产数据 - 使用slug作为新的主键id
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
  -- 将JSONB转换为TEXT[]，如果为null则使用空数组
  COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(p.tags_zh)),
    ARRAY[]::TEXT[]
  ),
  p.is_featured, p.is_published, p.created_at, p.updated_at
FROM public.properties_2026_02_21_08_00 p
ON CONFLICT (id) DO NOTHING;

-- 验证房产数据迁移
SELECT 
  'Properties Migration' as check_type,
  COUNT(*) as properties_count,
  COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count
FROM public.properties_optimized_2026_02_21_17_00;

-- 查看前5个房产的ID格式
SELECT id, title_zh, is_featured, array_length(tags_zh, 1) as tags_count
FROM public.properties_optimized_2026_02_21_17_00
ORDER BY id
LIMIT 5;