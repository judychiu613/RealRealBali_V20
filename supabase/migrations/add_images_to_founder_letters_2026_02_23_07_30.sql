-- 为创始人信件表添加图片字段
ALTER TABLE public.founder_letters 
ADD COLUMN IF NOT EXISTS image_1_url TEXT,
ADD COLUMN IF NOT EXISTS image_2_url TEXT,
ADD COLUMN IF NOT EXISTS image_3_url TEXT,
ADD COLUMN IF NOT EXISTS image_1_alt_zh VARCHAR(200),
ADD COLUMN IF NOT EXISTS image_1_alt_en VARCHAR(200),
ADD COLUMN IF NOT EXISTS image_2_alt_zh VARCHAR(200),
ADD COLUMN IF NOT EXISTS image_2_alt_en VARCHAR(200),
ADD COLUMN IF NOT EXISTS image_3_alt_zh VARCHAR(200),
ADD COLUMN IF NOT EXISTS image_3_alt_en VARCHAR(200);

-- 更新现有记录，添加图片信息
UPDATE public.founder_letters 
SET 
    image_1_url = 'MONOCHROME_VERTICAL_1',
    image_2_url = 'MONOCHROME_VERTICAL_2', 
    image_3_url = 'MONOCHROME_VERTICAL_3',
    image_1_alt_zh = '现代建筑美学',
    image_1_alt_en = 'Modern Architecture',
    image_2_alt_zh = '极简设计理念',
    image_2_alt_en = 'Minimalist Design',
    image_3_alt_zh = '专业空间构造',
    image_3_alt_en = 'Professional Space'
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
    image_3_alt_zh,
    updated_at
FROM public.founder_letters
WHERE is_active = true;