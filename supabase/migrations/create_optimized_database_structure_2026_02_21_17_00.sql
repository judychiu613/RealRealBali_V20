-- 创建优化的数据库结构，使用房源编号作为主键
-- 时间戳：2026_02_21_17_00

-- 1. 创建房产区域表（保持不变）
CREATE TABLE IF NOT EXISTS public.property_areas_optimized_2026_02_21_17_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建房产类型表（保持不变）
CREATE TABLE IF NOT EXISTS public.property_types_optimized_2026_02_21_17_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建优化的房产主表 - 使用房源编号作为主键
CREATE TABLE IF NOT EXISTS public.properties_optimized_2026_02_21_17_00 (
  id VARCHAR(20) PRIMARY KEY, -- 直接使用 prop-001, prop-002 等作为主键
  title_en VARCHAR(200) NOT NULL,
  title_zh VARCHAR(200) NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  price_usd INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  building_area INTEGER NOT NULL, -- 平方米
  land_area INTEGER NOT NULL, -- 平方米
  area_id UUID REFERENCES public.property_areas_optimized_2026_02_21_17_00(id),
  type_id UUID REFERENCES public.property_types_optimized_2026_02_21_17_00(id),
  status property_status DEFAULT 'available',
  ownership property_ownership DEFAULT 'leasehold',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  tags_en TEXT[],
  tags_zh TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 创建房产图片表 - 引用房源编号
CREATE TABLE IF NOT EXISTS public.property_images_optimized_2026_02_21_17_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id VARCHAR(20) REFERENCES public.properties_optimized_2026_02_21_17_00(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type VARCHAR(20) DEFAULT 'general', -- exterior, interior, view, general
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建房产设施表（保持不变）
CREATE TABLE IF NOT EXISTS public.property_amenities_optimized_2026_02_21_17_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建房产设施关联表 - 引用房源编号
CREATE TABLE IF NOT EXISTS public.property_amenity_relations_optimized_2026_02_21_17_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id VARCHAR(20) REFERENCES public.properties_optimized_2026_02_21_17_00(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES public.property_amenities_optimized_2026_02_21_17_00(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, amenity_id)
);

-- 7. 创建房产询盘表 - 引用房源编号
CREATE TABLE IF NOT EXISTS public.property_inquiries_optimized_2026_02_21_17_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id VARCHAR(20) REFERENCES public.properties_optimized_2026_02_21_17_00(id),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  inquiry_type VARCHAR(50) DEFAULT 'general', -- general, viewing, purchase, rental
  status VARCHAR(20) DEFAULT 'pending', -- pending, contacted, closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 创建房产浏览记录表 - 引用房源编号
CREATE TABLE IF NOT EXISTS public.property_views_optimized_2026_02_21_17_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id VARCHAR(20) REFERENCES public.properties_optimized_2026_02_21_17_00(id),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_properties_optimized_area ON public.properties_optimized_2026_02_21_17_00(area_id);
CREATE INDEX IF NOT EXISTS idx_properties_optimized_type ON public.properties_optimized_2026_02_21_17_00(type_id);
CREATE INDEX IF NOT EXISTS idx_properties_optimized_featured ON public.properties_optimized_2026_02_21_17_00(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_optimized_published ON public.properties_optimized_2026_02_21_17_00(is_published);
CREATE INDEX IF NOT EXISTS idx_properties_optimized_price ON public.properties_optimized_2026_02_21_17_00(price_usd);
CREATE INDEX IF NOT EXISTS idx_property_images_optimized_property ON public.property_images_optimized_2026_02_21_17_00(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_optimized_primary ON public.property_images_optimized_2026_02_21_17_00(is_primary);
CREATE INDEX IF NOT EXISTS idx_property_views_optimized_property ON public.property_views_optimized_2026_02_21_17_00(property_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_optimized_property ON public.property_inquiries_optimized_2026_02_21_17_00(property_id);