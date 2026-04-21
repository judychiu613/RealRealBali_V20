-- 删除现有的外键约束
ALTER TABLE public.properties_final_2026_02_21_17_30 
DROP CONSTRAINT IF EXISTS properties_type_mapping_fkey;

-- 更新房源表的type_id为新的简化类型表ID
UPDATE public.properties_final_2026_02_21_17_30 SET 
    type_id = (
        SELECT pts.id
        FROM public.property_types_simple_2026_02_22_09_00 pts
        WHERE 
            -- 根据现有映射表的category信息匹配到新的简化类型
            pts.name_en = (
                SELECT ptm.category_en 
                FROM public.property_type_mapping_2026_02_22_08_30 ptm 
                WHERE ptm.id = properties_final_2026_02_21_17_30.type_id
                LIMIT 1
            )
        LIMIT 1
    )
WHERE type_id IS NOT NULL;

-- 为没有匹配到的房源设置默认类型（别墅）
UPDATE public.properties_final_2026_02_21_17_30 
SET type_id = (SELECT id FROM public.property_types_simple_2026_02_22_09_00 WHERE name_en = 'Villa' LIMIT 1)
WHERE type_id IS NULL;

-- 添加新的外键约束到新的简化类型表
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD CONSTRAINT properties_simple_type_fkey 
FOREIGN KEY (type_id) REFERENCES public.property_types_simple_2026_02_22_09_00(id);