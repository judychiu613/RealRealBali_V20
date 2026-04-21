-- ========================================
-- 更新Seminyak区域中文翻译
-- Update Seminyak Chinese Translation
-- 更新时间: 2026-02-21 08:15 UTC
-- ========================================

-- 更新Seminyak的中文名称为"水明漾"
UPDATE public.property_areas_2026_02_21_08_00 
SET 
    name_zh = '水明漾',
    description_zh = '高档海滨小镇，以高端餐饮和购物闻名',
    updated_at = NOW()
WHERE slug = 'seminyak';

-- 验证更新结果
SELECT 
    name_en,
    name_zh,
    slug,
    description_zh
FROM public.property_areas_2026_02_21_08_00 
WHERE slug = 'seminyak';