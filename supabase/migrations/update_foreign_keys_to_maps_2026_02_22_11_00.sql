-- 更新properties表外键约束

-- 1. 删除旧的外键约束
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_area_id_fkey;
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_type_id_fkey;
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_land_zone_id_fkey;

-- 2. 添加新的外键约束，指向映射表
ALTER TABLE public.properties 
ADD CONSTRAINT properties_area_id_fkey 
FOREIGN KEY (area_id) REFERENCES public.property_areas_map(id);

ALTER TABLE public.properties 
ADD CONSTRAINT properties_type_id_fkey 
FOREIGN KEY (type_id) REFERENCES public.property_types_map(id);

ALTER TABLE public.properties 
ADD CONSTRAINT properties_land_zone_id_fkey 
FOREIGN KEY (land_zone_id) REFERENCES public.land_zones_map(id);

-- 3. 为新的映射表启用RLS并创建策略
ALTER TABLE public.land_zones_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_areas_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_types_map ENABLE ROW LEVEL SECURITY;

-- 映射表策略 - 所有人可以查看
CREATE POLICY "Anyone can view land zones map" ON public.land_zones_map
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view property areas map" ON public.property_areas_map
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view property types map" ON public.property_types_map
    FOR SELECT USING (true);

-- 4. 验证外键约束
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
AND tc.table_name = 'properties'
ORDER BY tc.constraint_name;