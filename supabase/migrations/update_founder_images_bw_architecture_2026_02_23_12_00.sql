-- 更新创始人信件的图片为黑白建筑风格
-- 使用新搜索到的黑白建筑图片

UPDATE public.founder_letters 
SET 
  image_1_url = 'TROPICAL_ARCHITECTURE_BW_1',
  image_1_alt_zh = '现代建筑美学',
  image_1_alt_en = 'Modern Architecture Aesthetics',
  
  image_2_url = 'BALI_TEMPLE_BW_3', 
  image_2_alt_zh = '建筑光影艺术',
  image_2_alt_en = 'Architectural Light and Shadow',
  
  image_3_url = 'TROPICAL_ARCHITECTURE_BW_4',
  image_3_alt_zh = '极简空间设计',
  image_3_alt_en = 'Minimalist Space Design',
  
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