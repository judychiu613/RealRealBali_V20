-- 首先备份现有的type_id映射
CREATE TEMP TABLE temp_type_mapping AS
SELECT 
    p.id as property_id,
    p.type_id as old_type_id,
    pt.name_en as old_type_name_en,
    pt.name_zh as old_type_name_zh
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_types_final_2026_02_21_17_30 pt ON p.type_id = pt.id;

-- 更新房源表的type_id为新的映射表ID
UPDATE public.properties_final_2026_02_21_17_30 SET 
    type_id = (
        SELECT ptm.id::uuid
        FROM public.property_type_mapping_2026_02_22_08_30 ptm
        WHERE 
            -- 根据现有类型名称匹配到新的映射
            (ptm.name_en ILIKE '%' || COALESCE(
                (SELECT pt.name_en FROM public.property_types_final_2026_02_21_17_30 pt WHERE pt.id = properties_final_2026_02_21_17_30.type_id),
                'villa'
            ) || '%')
            OR 
            (ptm.name_zh LIKE '%' || COALESCE(
                (SELECT pt.name_zh FROM public.property_types_final_2026_02_21_17_30 pt WHERE pt.id = properties_final_2026_02_21_17_30.type_id),
                '别墅'
            ) || '%')
        ORDER BY ptm.sort_order
        LIMIT 1
    )
WHERE type_id IS NOT NULL;

-- 为没有匹配到的房源设置默认类型
UPDATE public.properties_final_2026_02_21_17_30 
SET type_id = 'modern_villa'::uuid
WHERE type_id IS NULL;

-- 删除之前添加的category_id和subcategory_id字段
ALTER TABLE public.properties_final_2026_02_21_17_30 
DROP COLUMN IF EXISTS category_id,
DROP COLUMN IF EXISTS subcategory_id;