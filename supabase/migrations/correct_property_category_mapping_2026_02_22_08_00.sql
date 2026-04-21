-- 为房源表添加新的分类字段（如果还没有的话）
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES public.property_categories_2026_02_22_08_00(id),
ADD COLUMN IF NOT EXISTS subcategory_id TEXT REFERENCES public.property_subcategories_2026_02_22_08_00(id);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties_final_2026_02_21_17_30(category_id);
CREATE INDEX IF NOT EXISTS idx_properties_subcategory ON public.properties_final_2026_02_21_17_30(subcategory_id);

-- 根据现有的type_id通过JOIN来映射到新的分类系统
UPDATE public.properties_final_2026_02_21_17_30 SET 
    category_id = CASE 
        WHEN pt.name_en ILIKE '%villa%' OR pt.name_zh LIKE '%别墅%' THEN 'villa'
        WHEN pt.name_en ILIKE '%land%' OR pt.name_zh LIKE '%土地%' THEN 'land'
        WHEN pt.name_en ILIKE '%commercial%' OR pt.name_en ILIKE '%hotel%' OR pt.name_en ILIKE '%restaurant%' 
             OR pt.name_zh LIKE '%商业%' OR pt.name_zh LIKE '%酒店%' OR pt.name_zh LIKE '%餐厅%' THEN 'commercial'
        ELSE 'villa' -- 默认为别墅
    END,
    subcategory_id = CASE 
        -- 别墅子类映射
        WHEN pt.name_en ILIKE '%luxury%villa%' OR pt.name_zh LIKE '%豪华别墅%' THEN 'villa_luxury'
        WHEN pt.name_en ILIKE '%beachfront%villa%' OR pt.name_zh LIKE '%海滨别墅%' THEN 'villa_beachfront'
        WHEN pt.name_en ILIKE '%hillside%villa%' OR pt.name_zh LIKE '%山坡别墅%' THEN 'villa_hillside'
        WHEN pt.name_en ILIKE '%traditional%villa%' OR pt.name_zh LIKE '%传统别墅%' THEN 'villa_traditional'
        WHEN pt.name_en ILIKE '%villa%' OR pt.name_zh LIKE '%别墅%' THEN 'villa_modern'
        
        -- 土地子类映射
        WHEN pt.name_en ILIKE '%residential%land%' OR pt.name_zh LIKE '%住宅用地%' THEN 'land_residential'
        WHEN pt.name_en ILIKE '%commercial%land%' OR pt.name_zh LIKE '%商业用地%' THEN 'land_commercial'
        WHEN pt.name_en ILIKE '%agricultural%land%' OR pt.name_zh LIKE '%农业用地%' THEN 'land_agricultural'
        WHEN pt.name_en ILIKE '%beachfront%land%' OR pt.name_zh LIKE '%海滨用地%' THEN 'land_beachfront'
        WHEN pt.name_en ILIKE '%land%' OR pt.name_zh LIKE '%土地%' THEN 'land_investment'
        
        -- 商业子类映射
        WHEN pt.name_en ILIKE '%hotel%' OR pt.name_zh LIKE '%酒店%' THEN 'commercial_hotel'
        WHEN pt.name_en ILIKE '%restaurant%' OR pt.name_zh LIKE '%餐厅%' THEN 'commercial_restaurant'
        WHEN pt.name_en ILIKE '%retail%' OR pt.name_zh LIKE '%零售%' THEN 'commercial_retail'
        WHEN pt.name_en ILIKE '%office%' OR pt.name_zh LIKE '%办公%' THEN 'commercial_office'
        WHEN pt.name_en ILIKE '%warehouse%' OR pt.name_zh LIKE '%仓库%' THEN 'commercial_warehouse'
        WHEN pt.name_en ILIKE '%commercial%' OR pt.name_zh LIKE '%商业%' THEN 'commercial_office'
        
        -- 默认映射
        ELSE 'villa_modern'
    END
FROM public.property_types_final_2026_02_21_17_30 pt
WHERE public.properties_final_2026_02_21_17_30.type_id = pt.id
AND (category_id IS NULL OR subcategory_id IS NULL);