-- 为新表创建RLS策略

-- 启用RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites_map ENABLE ROW LEVEL SECURITY;

-- 房源表策略 - 所有人可以查看已发布的房源
CREATE POLICY "Anyone can view published properties" ON public.properties
    FOR SELECT USING (is_published = true);

-- 房源类型表策略 - 所有人可以查看
CREATE POLICY "Anyone can view property types" ON public.property_types
    FOR SELECT USING (true);

-- 房源区域表策略 - 所有人可以查看
CREATE POLICY "Anyone can view property areas" ON public.property_areas
    FOR SELECT USING (true);

-- 土地形式表策略 - 所有人可以查看
CREATE POLICY "Anyone can view land zones" ON public.land_zones
    FOR SELECT USING (true);

-- 房源图片表策略 - 所有人可以查看已发布房源的图片
CREATE POLICY "Anyone can view property images" ON public.property_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.properties 
            WHERE properties.id = property_images.property_id 
            AND properties.is_published = true
        )
    );

-- 用户收藏映射表策略 - 用户只能查看和管理自己的收藏
CREATE POLICY "Users can view own favorites" ON public.user_favorites_map
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.user_favorites_map
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.user_favorites_map
    FOR DELETE USING (auth.uid() = user_id);

-- 验证策略创建
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('properties', 'property_types', 'property_areas', 'land_zones', 'property_images', 'user_favorites_map')
ORDER BY tablename, policyname;