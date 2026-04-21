-- 为优化数据库设置RLS策略和触发器

-- 启用RLS
ALTER TABLE public.property_areas_optimized_2026_02_21_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_types_optimized_2026_02_21_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties_optimized_2026_02_21_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images_optimized_2026_02_21_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities_optimized_2026_02_21_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenity_relations_optimized_2026_02_21_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries_optimized_2026_02_21_17_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views_optimized_2026_02_21_17_00 ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略 - 公开读取已发布的房产信息
CREATE POLICY "Public read access for published areas" ON public.property_areas_optimized_2026_02_21_17_00
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for active types" ON public.property_types_optimized_2026_02_21_17_00
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for published properties" ON public.properties_optimized_2026_02_21_17_00
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for property images" ON public.property_images_optimized_2026_02_21_17_00
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties_optimized_2026_02_21_17_00 p 
      WHERE p.id = property_id AND p.is_published = true
    )
  );

CREATE POLICY "Public read access for amenities" ON public.property_amenities_optimized_2026_02_21_17_00
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for property amenities" ON public.property_amenity_relations_optimized_2026_02_21_17_00
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties_optimized_2026_02_21_17_00 p 
      WHERE p.id = property_id AND p.is_published = true
    )
  );

-- 询盘策略 - 用户可以创建和查看自己的询盘
CREATE POLICY "Users can create inquiries" ON public.property_inquiries_optimized_2026_02_21_17_00
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own inquiries" ON public.property_inquiries_optimized_2026_02_21_17_00
  FOR SELECT USING (auth.uid() = user_id);

-- 浏览记录策略 - 用户可以创建和查看自己的浏览记录
CREATE POLICY "Users can create views" ON public.property_views_optimized_2026_02_21_17_00
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own records" ON public.property_views_optimized_2026_02_21_17_00
  FOR SELECT USING (auth.uid() = user_id);

-- 创建更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间戳触发器
CREATE TRIGGER update_property_areas_optimized_updated_at 
  BEFORE UPDATE ON public.property_areas_optimized_2026_02_21_17_00 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_types_optimized_updated_at 
  BEFORE UPDATE ON public.property_types_optimized_2026_02_21_17_00 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_optimized_updated_at 
  BEFORE UPDATE ON public.properties_optimized_2026_02_21_17_00 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_inquiries_optimized_updated_at 
  BEFORE UPDATE ON public.property_inquiries_optimized_2026_02_21_17_00 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();