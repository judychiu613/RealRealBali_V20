-- 验证最终数据库结构和功能完整性

-- 1. 验证房产数据完整性（多货币和英文标签）
SELECT 
  'Property Data Completeness' as check_type,
  COUNT(*) as total_properties,
  COUNT(CASE WHEN price_cny IS NOT NULL THEN 1 END) as with_cny_price,
  COUNT(CASE WHEN price_idr IS NOT NULL THEN 1 END) as with_idr_price,
  COUNT(CASE WHEN array_length(tags_en, 1) > 0 THEN 1 END) as with_english_tags,
  COUNT(CASE WHEN array_length(tags_zh, 1) > 0 THEN 1 END) as with_chinese_tags
FROM public.properties_final_2026_02_21_17_30;

-- 2. 验证两级区域结构
SELECT 
  'Area Structure Check' as check_type,
  COUNT(*) as total_areas,
  COUNT(CASE WHEN level = 1 THEN 1 END) as level_1_areas,
  COUNT(CASE WHEN level = 2 THEN 1 END) as level_2_areas,
  COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as child_areas
FROM public.property_areas_final_2026_02_21_17_30;

-- 3. 验证房间数量和土地面积分布（用于筛选）
SELECT 
  'Property Distribution' as check_type,
  MIN(bedrooms) as min_bedrooms,
  MAX(bedrooms) as max_bedrooms,
  ROUND(AVG(bedrooms), 1) as avg_bedrooms,
  MIN(land_area) as min_land_area,
  MAX(land_area) as max_land_area,
  ROUND(AVG(land_area)) as avg_land_area
FROM public.properties_final_2026_02_21_17_30;

-- 4. 验证多货币价格范围
SELECT 
  'Multi-Currency Price Ranges' as check_type,
  MIN(price_usd) as min_usd,
  MAX(price_usd) as max_usd,
  MIN(price_cny) as min_cny,
  MAX(price_cny) as max_cny,
  MIN(price_idr) as min_idr,
  MAX(price_idr) as max_idr
FROM public.properties_final_2026_02_21_17_30;

-- 5. 查看示例房产数据（验证所有新功能）
SELECT 
  id,
  title_en,
  title_zh,
  price_usd,
  price_cny,
  price_idr,
  bedrooms,
  land_area,
  area_id,
  array_length(tags_en, 1) as english_tags_count,
  array_length(tags_zh, 1) as chinese_tags_count,
  tags_en[1] as first_english_tag,
  tags_zh[1] as first_chinese_tag
FROM public.properties_final_2026_02_21_17_30
ORDER BY id
LIMIT 5;

-- 6. 验证图片数据完整性
SELECT 
  'Image Data Check' as check_type,
  COUNT(*) as total_images,
  COUNT(DISTINCT property_id) as properties_with_images,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_images,
  ROUND(COUNT(*)::numeric / COUNT(DISTINCT property_id), 2) as avg_images_per_property
FROM public.property_images_final_2026_02_21_17_30;

-- 7. 验证区域层级关系
SELECT 
  p.id as parent_id,
  p.name_en as parent_name_en,
  p.name_zh as parent_name_zh,
  COUNT(c.id) as child_count,
  STRING_AGG(c.name_en, ', ') as children_en
FROM public.property_areas_final_2026_02_21_17_30 p
LEFT JOIN public.property_areas_final_2026_02_21_17_30 c ON p.id = c.parent_id
WHERE p.level = 1
GROUP BY p.id, p.name_en, p.name_zh, p.sort_order
ORDER BY p.sort_order
LIMIT 5;