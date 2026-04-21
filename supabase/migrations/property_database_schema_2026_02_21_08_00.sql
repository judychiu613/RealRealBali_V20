-- ========================================
-- 巴厘岛房产中介数据库架构设计
-- Bali Property Agency Database Schema
-- 创建时间: 2026-02-21 08:00 UTC
-- ========================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. 房产区域表 (Property Areas)
-- ========================================
CREATE TABLE IF NOT EXISTS public.property_areas_2026_02_21_08_00 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(100) NOT NULL UNIQUE,
    name_zh VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description_en TEXT,
    description_zh TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_areas_slug ON public.property_areas_2026_02_21_08_00(slug);
CREATE INDEX IF NOT EXISTS idx_property_areas_featured ON public.property_areas_2026_02_21_08_00(is_featured);

-- ========================================
-- 2. 房产类型表 (Property Types)
-- ========================================
CREATE TABLE IF NOT EXISTS public.property_types_2026_02_21_08_00 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(100) NOT NULL UNIQUE,
    name_zh VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description_en TEXT,
    description_zh TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_types_slug ON public.property_types_2026_02_21_08_00(slug);
CREATE INDEX IF NOT EXISTS idx_property_types_active ON public.property_types_2026_02_21_08_00(is_active);

-- ========================================
-- 3. 房产状态枚举
-- ========================================
CREATE TYPE property_status AS ENUM ('available', 'sold', 'reserved', 'off_market');
CREATE TYPE property_ownership AS ENUM ('freehold', 'leasehold');
CREATE TYPE property_land_type AS ENUM ('residential', 'commercial', 'mixed', 'agricultural');

-- ========================================
-- 4. 主要房产信息表 (Properties)
-- ========================================
CREATE TABLE IF NOT EXISTS public.properties_2026_02_21_08_00 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- 基本信息
    title_en VARCHAR(200) NOT NULL,
    title_zh VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description_en TEXT,
    description_zh TEXT,
    
    -- 分类关联
    area_id UUID REFERENCES public.property_areas_2026_02_21_08_00(id) ON DELETE SET NULL,
    type_id UUID REFERENCES public.property_types_2026_02_21_08_00(id) ON DELETE SET NULL,
    
    -- 价格信息
    price_usd DECIMAL(12,2) NOT NULL,
    price_idr DECIMAL(15,0),
    price_cny DECIMAL(12,2),
    price_per_sqm_usd DECIMAL(10,2),
    
    -- 房产规格
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    building_area DECIMAL(10,2), -- 建筑面积 (平方米)
    land_area DECIMAL(10,2),     -- 土地面积 (平方米)
    
    -- 房产属性
    status property_status DEFAULT 'available',
    ownership property_ownership DEFAULT 'leasehold',
    land_type property_land_type DEFAULT 'residential',
    
    -- 特色标签 (JSON数组)
    tags_en JSONB DEFAULT '[]',
    tags_zh JSONB DEFAULT '[]',
    
    -- 地理位置
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address_en TEXT,
    address_zh TEXT,
    
    -- 特殊标记
    is_featured BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    
    -- 显示控制
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties_2026_02_21_08_00(slug);
CREATE INDEX IF NOT EXISTS idx_properties_area ON public.properties_2026_02_21_08_00(area_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties_2026_02_21_08_00(type_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties_2026_02_21_08_00(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties_2026_02_21_08_00(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_published ON public.properties_2026_02_21_08_00(is_published);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties_2026_02_21_08_00(price_usd);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON public.properties_2026_02_21_08_00(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties_2026_02_21_08_00(latitude, longitude);

-- ========================================
-- 5. 房产图片表 (Property Images)
-- ========================================
CREATE TABLE IF NOT EXISTS public.property_images_2026_02_21_08_00 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties_2026_02_21_08_00(id) ON DELETE CASCADE,
    
    -- 图片信息
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    alt_text_en VARCHAR(200),
    alt_text_zh VARCHAR(200),
    caption_en TEXT,
    caption_zh TEXT,
    
    -- 图片属性
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    image_type VARCHAR(50) DEFAULT 'general', -- general, exterior, interior, view, floor_plan
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_images_property ON public.property_images_2026_02_21_08_00(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_primary ON public.property_images_2026_02_21_08_00(is_primary);
CREATE INDEX IF NOT EXISTS idx_property_images_order ON public.property_images_2026_02_21_08_00(property_id, sort_order);

-- ========================================
-- 6. 房产设施表 (Property Amenities)
-- ========================================
CREATE TABLE IF NOT EXISTS public.property_amenities_2026_02_21_08_00 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(100) NOT NULL UNIQUE,
    name_zh VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    category VARCHAR(50) DEFAULT 'general', -- general, security, recreation, utilities
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. 房产设施关联表 (Property Amenity Relations)
-- ========================================
CREATE TABLE IF NOT EXISTS public.property_amenity_relations_2026_02_21_08_00 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties_2026_02_21_08_00(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES public.property_amenities_2026_02_21_08_00(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(property_id, amenity_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_amenities_property ON public.property_amenity_relations_2026_02_21_08_00(property_id);
CREATE INDEX IF NOT EXISTS idx_property_amenities_amenity ON public.property_amenity_relations_2026_02_21_08_00(amenity_id);

-- ========================================
-- 8. 房产询盘表 (Property Inquiries)
-- ========================================
CREATE TABLE IF NOT EXISTS public.property_inquiries_2026_02_21_08_00 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties_2026_02_21_08_00(id) ON DELETE SET NULL,
    
    -- 联系人信息
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    
    -- 询盘内容
    message TEXT,
    inquiry_type VARCHAR(50) DEFAULT 'general', -- general, viewing, purchase, rent
    preferred_contact VARCHAR(50) DEFAULT 'email', -- email, phone, whatsapp
    
    -- 状态管理
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, closed
    assigned_to UUID, -- 可以关联到员工表
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contacted_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_inquiries_property ON public.property_inquiries_2026_02_21_08_00(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.property_inquiries_2026_02_21_08_00(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON public.property_inquiries_2026_02_21_08_00(created_at);

-- ========================================
-- 9. 房产浏览记录表 (Property Views)
-- ========================================
CREATE TABLE IF NOT EXISTS public.property_views_2026_02_21_08_00 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties_2026_02_21_08_00(id) ON DELETE CASCADE,
    user_id UUID, -- 可以关联到用户表，匿名用户为NULL
    
    -- 浏览信息
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    session_id VARCHAR(255),
    
    -- 时间戳
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_views_property ON public.property_views_2026_02_21_08_00(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_user ON public.property_views_2026_02_21_08_00(user_id);
CREATE INDEX IF NOT EXISTS idx_property_views_date ON public.property_views_2026_02_21_08_00(viewed_at);

-- ========================================
-- 10. 更新时间戳触发器函数
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建更新时间戳触发器
CREATE TRIGGER update_property_areas_updated_at 
    BEFORE UPDATE ON public.property_areas_2026_02_21_08_00 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_types_updated_at 
    BEFORE UPDATE ON public.property_types_2026_02_21_08_00 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON public.properties_2026_02_21_08_00 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_images_updated_at 
    BEFORE UPDATE ON public.property_images_2026_02_21_08_00 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_inquiries_updated_at 
    BEFORE UPDATE ON public.property_inquiries_2026_02_21_08_00 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 11. 行级安全策略 (Row Level Security)
-- ========================================

-- 启用RLS
ALTER TABLE public.property_areas_2026_02_21_08_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_types_2026_02_21_08_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties_2026_02_21_08_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images_2026_02_21_08_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities_2026_02_21_08_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenity_relations_2026_02_21_08_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries_2026_02_21_08_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views_2026_02_21_08_00 ENABLE ROW LEVEL SECURITY;

-- 公开读取策略 (所有已发布的房产信息对所有人可见)
CREATE POLICY "Public read access for property areas" ON public.property_areas_2026_02_21_08_00
    FOR SELECT USING (true);

CREATE POLICY "Public read access for property types" ON public.property_types_2026_02_21_08_00
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for published properties" ON public.properties_2026_02_21_08_00
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for property images" ON public.property_images_2026_02_21_08_00
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.properties_2026_02_21_08_00 p 
            WHERE p.id = property_id AND p.is_published = true
        )
    );

CREATE POLICY "Public read access for amenities" ON public.property_amenities_2026_02_21_08_00
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access for property amenities" ON public.property_amenity_relations_2026_02_21_08_00
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.properties_2026_02_21_08_00 p 
            WHERE p.id = property_id AND p.is_published = true
        )
    );

-- 询盘表：任何人都可以创建询盘，但只能看到自己的询盘
CREATE POLICY "Anyone can create inquiries" ON public.property_inquiries_2026_02_21_08_00
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own inquiries" ON public.property_inquiries_2026_02_21_08_00
    FOR SELECT USING (auth.uid()::text = email OR auth.role() = 'service_role');

-- 浏览记录：任何人都可以创建浏览记录
CREATE POLICY "Anyone can create property views" ON public.property_views_2026_02_21_08_00
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own property views" ON public.property_views_2026_02_21_08_00
    FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- ========================================
-- 数据库架构创建完成
-- ========================================

COMMENT ON TABLE public.property_areas_2026_02_21_08_00 IS '房产区域表 - 存储巴厘岛各个区域信息';
COMMENT ON TABLE public.property_types_2026_02_21_08_00 IS '房产类型表 - 存储别墅、公寓等房产类型';
COMMENT ON TABLE public.properties_2026_02_21_08_00 IS '主要房产信息表 - 存储所有房产的详细信息';
COMMENT ON TABLE public.property_images_2026_02_21_08_00 IS '房产图片表 - 存储房产相关的所有图片';
COMMENT ON TABLE public.property_amenities_2026_02_21_08_00 IS '房产设施表 - 存储游泳池、花园等设施信息';
COMMENT ON TABLE public.property_amenity_relations_2026_02_21_08_00 IS '房产设施关联表 - 多对多关系';
COMMENT ON TABLE public.property_inquiries_2026_02_21_08_00 IS '房产询盘表 - 存储客户询盘信息';
COMMENT ON TABLE public.property_views_2026_02_21_08_00 IS '房产浏览记录表 - 统计分析用途';