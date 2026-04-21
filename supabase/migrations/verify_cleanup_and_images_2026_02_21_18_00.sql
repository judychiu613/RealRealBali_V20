-- 验证数据库清理和图片多样化的最终结果

-- 1. 验证数据库表清理结果
SELECT 
  'Database Tables Status' as check_type,
  table_name,
  CASE 
    WHEN table_name LIKE '%final_2026_02_21_17_30%' THEN 'ACTIVE - Final Version'
    WHEN table_name LIKE '%optimized_2026_02_21_17_00%' THEN 'ERROR - Should be deleted'
    WHEN table_name LIKE '%2026_02_21_08_00%' THEN 'ERROR - Should be deleted'
    ELSE 'OTHER'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%property%'
ORDER BY table_name;

-- 2. 验证图片多样化结果
SELECT 
  'Image Diversity Check' as check_type,
  property_id,
  COUNT(*) as image_count,
  COUNT(CASE WHEN is_primary = true THEN 1 END) as primary_count,
  STRING_AGG(DISTINCT SUBSTRING(image_url FROM 'photo-([^?]+)'), ', ') as unique_image_ids
FROM public.property_images_final_2026_02_21_17_30
GROUP BY property_id
ORDER BY property_id;

-- 3. 验证房产类型关联
SELECT 
  'Property Type Relations' as check_type,
  p.id,
  p.title_zh,
  pt.name_zh as type_name,
  pt.slug as type_slug,
  COUNT(pi.id) as image_count
FROM public.properties_final_2026_02_21_17_30 p
JOIN public.property_types_final_2026_02_21_17_30 pt ON p.type_id = pt.id
LEFT JOIN public.property_images_final_2026_02_21_17_30 pi ON p.id = pi.property_id
GROUP BY p.id, p.title_zh, pt.name_zh, pt.slug
ORDER BY p.id;

-- 4. 验证图片URL的唯一性（确保不同房产使用不同图片）
SELECT 
  'Image Uniqueness Check' as check_type,
  COUNT(DISTINCT image_url) as unique_images,
  COUNT(*) as total_image_records,
  ROUND(COUNT(DISTINCT image_url)::numeric / COUNT(*) * 100, 2) as uniqueness_percentage
FROM public.property_images_final_2026_02_21_17_30;

-- 5. 查看前3个房产的具体图片URL（验证多样性）
SELECT 
  property_id,
  sort_order,
  image_type,
  SUBSTRING(image_url FROM 'photo-([^?]+)') as image_id,
  is_primary
FROM public.property_images_final_2026_02_21_17_30
WHERE property_id IN ('prop-001', 'prop-002', 'prop-003')
ORDER BY property_id, sort_order;