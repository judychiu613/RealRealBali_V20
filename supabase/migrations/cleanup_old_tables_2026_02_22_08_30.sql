-- 删除旧的类型表（现在已被映射表替代）
DROP TABLE IF EXISTS public.property_types_final_2026_02_21_17_30 CASCADE;

-- 删除之前创建的分类表（不再需要）
DROP TABLE IF EXISTS public.property_categories_2026_02_22_08_00 CASCADE;
DROP TABLE IF EXISTS public.property_subcategories_2026_02_22_08_00 CASCADE;

-- 验证清理结果
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%property_type%' 
OR table_name LIKE '%property_categor%'
ORDER BY table_name;