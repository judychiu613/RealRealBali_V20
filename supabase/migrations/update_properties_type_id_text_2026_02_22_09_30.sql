-- 修改房源表的type_id字段类型为TEXT
ALTER TABLE public.properties_final_2026_02_21_17_30 
ALTER COLUMN type_id TYPE TEXT;

-- 更新所有房源的type_id为新的字符串ID，默认设为'villa'
UPDATE public.properties_final_2026_02_21_17_30 
SET type_id = 'villa';

-- 可以根据房源名称或其他特征来分配更合适的类型
-- 这里简单地将所有房源设为别墅类型，后续可以手动调整

-- 添加外键约束到新的类型表
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD CONSTRAINT properties_final_type_fkey 
FOREIGN KEY (type_id) REFERENCES public.property_types_final_2026_02_22_09_30(id);

-- 验证更新结果
SELECT 
    pt.id,
    pt.name_en,
    pt.name_zh,
    COUNT(p.id) as property_count
FROM public.property_types_final_2026_02_22_09_30 pt
LEFT JOIN public.properties_final_2026_02_21_17_30 p ON p.type_id = pt.id
GROUP BY pt.id, pt.name_en, pt.name_zh, pt.sort_order
ORDER BY pt.sort_order;