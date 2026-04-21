-- 更新创始人信件的图片为巴厘岛特色风景
-- 海岸悬崖、热带棕榈树、传统建筑

UPDATE public.founder_letters 
SET 
  image_1_url = 'DRAMATIC_COASTLINE_1',
  image_1_alt_zh = '巴厘岛悬崖海景',
  image_1_alt_en = 'Bali Cliff Ocean View',
  
  image_2_url = 'TROPICAL_LANDSCAPE_1', 
  image_2_alt_zh = '热带棕榈风光',
  image_2_alt_en = 'Tropical Palm Landscape',
  
  image_3_url = 'TRADITIONAL_ARCHITECTURE_2',
  image_3_alt_zh = '巴厘岛传统建筑',
  image_3_alt_en = 'Bali Traditional Architecture',
  
  updated_at = NOW()
WHERE is_active = true;

-- 验证更新结果
SELECT 
  id,
  title_zh,
  image_1_url,
  image_2_url, 
  image_3_url,
  image_1_alt_zh,
  image_2_alt_zh,
  image_3_alt_zh
FROM public.founder_letters 
WHERE is_active = true;