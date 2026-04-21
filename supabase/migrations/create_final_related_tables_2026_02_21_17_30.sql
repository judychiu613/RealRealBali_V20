-- 创建其他关联表（图片、设施等）

-- 创建房产图片表
CREATE TABLE IF NOT EXISTS public.property_images_final_2026_02_21_17_30 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id VARCHAR(20) REFERENCES public.properties_final_2026_02_21_17_30(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type VARCHAR(20) DEFAULT 'general', -- exterior, interior, view, general
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建房产设施关联表
CREATE TABLE IF NOT EXISTS public.property_amenity_relations_final_2026_02_21_17_30 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id VARCHAR(20) REFERENCES public.properties_final_2026_02_21_17_30(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES public.property_amenities_optimized_2026_02_21_17_00(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, amenity_id)
);

-- 创建房产询盘表
CREATE TABLE IF NOT EXISTS public.property_inquiries_final_2026_02_21_17_30 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id VARCHAR(20) REFERENCES public.properties_final_2026_02_21_17_30(id),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  inquiry_type VARCHAR(50) DEFAULT 'general',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建房产浏览记录表
CREATE TABLE IF NOT EXISTS public.property_views_final_2026_02_21_17_30 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id VARCHAR(20) REFERENCES public.properties_final_2026_02_21_17_30(id),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_images_final_property ON public.property_images_final_2026_02_21_17_30(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_final_primary ON public.property_images_final_2026_02_21_17_30(is_primary);
CREATE INDEX IF NOT EXISTS idx_property_views_final_property ON public.property_views_final_2026_02_21_17_30(property_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_final_property ON public.property_inquiries_final_2026_02_21_17_30(property_id);

-- 启用RLS
ALTER TABLE public.property_images_final_2026_02_21_17_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenity_relations_final_2026_02_21_17_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries_final_2026_02_21_17_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views_final_2026_02_21_17_30 ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "Public read access for property images" ON public.property_images_final_2026_02_21_17_30
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties_final_2026_02_21_17_30 p 
      WHERE p.id = property_id AND p.is_published = true
    )
  );

CREATE POLICY "Public read access for property amenities" ON public.property_amenity_relations_final_2026_02_21_17_30
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties_final_2026_02_21_17_30 p 
      WHERE p.id = property_id AND p.is_published = true
    )
  );

CREATE POLICY "Users can create inquiries" ON public.property_inquiries_final_2026_02_21_17_30
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own inquiries" ON public.property_inquiries_final_2026_02_21_17_30
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create views" ON public.property_views_final_2026_02_21_17_30
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own records" ON public.property_views_final_2026_02_21_17_30
  FOR SELECT USING (auth.uid() = user_id);

-- 创建更新时间戳触发器
CREATE TRIGGER update_property_inquiries_final_updated_at 
  BEFORE UPDATE ON public.property_inquiries_final_2026_02_21_17_30 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 验证表创建
SELECT 
  'Final Tables Created' as status,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%final_2026_02_21_17_30%';