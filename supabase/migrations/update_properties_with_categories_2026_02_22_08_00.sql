-- 为房源表添加新的分类字段
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES public.property_categories_2026_02_22_08_00(id),
ADD COLUMN IF NOT EXISTS subcategory_id TEXT REFERENCES public.property_subcategories_2026_02_22_08_00(id);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties_final_2026_02_21_17_30(category_id);
CREATE INDEX IF NOT EXISTS idx_properties_subcategory ON public.properties_final_2026_02_21_17_30(subcategory_id);

-- 根据现有的type_id映射到新的分类系统
-- 首先查看现有的类型数据来做映射
UPDATE public.properties_final_2026_02_21_17_30 SET 
    category_id = CASE 
        WHEN type_id IN ('villa', 'luxury-villa', 'beachfront-villa', 'hillside-villa') THEN 'villa'
        WHEN type_id IN ('land', 'residential-land', 'commercial-land') THEN 'land'
        WHEN type_id IN ('commercial', 'hotel', 'restaurant', 'retail') THEN 'commercial'
        ELSE 'villa' -- 默认为别墅
    END,
    subcategory_id = CASE 
        -- 别墅子类映射
        WHEN type_id = 'luxury-villa' THEN 'villa_luxury'
        WHEN type_id = 'beachfront-villa' THEN 'villa_beachfront'
        WHEN type_id = 'hillside-villa' THEN 'villa_hillside'
        WHEN type_id = 'villa' THEN 'villa_modern'
        
        -- 土地子类映射
        WHEN type_id = 'residential-land' THEN 'land_residential'
        WHEN type_id = 'commercial-land' THEN 'land_commercial'
        WHEN type_id = 'land' THEN 'land_investment'
        
        -- 商业子类映射
        WHEN type_id = 'hotel' THEN 'commercial_hotel'
        WHEN type_id = 'restaurant' THEN 'commercial_restaurant'
        WHEN type_id = 'retail' THEN 'commercial_retail'
        WHEN type_id = 'commercial' THEN 'commercial_office'
        
        -- 默认映射
        ELSE 'villa_modern'
    END
WHERE category_id IS NULL OR subcategory_id IS NULL;