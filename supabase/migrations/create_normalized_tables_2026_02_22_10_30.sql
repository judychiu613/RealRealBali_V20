-- 创建新的规范化表格结构

-- 1. 房源类型表
CREATE TABLE IF NOT EXISTS public.property_types (
    id text PRIMARY KEY,
    name_en text NOT NULL,
    name_zh text NOT NULL,
    description_en text,
    description_zh text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. 房源区域表
CREATE TABLE IF NOT EXISTS public.property_areas (
    id text PRIMARY KEY,
    name_en text NOT NULL,
    name_zh text NOT NULL,
    description_en text,
    description_zh text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. 土地形式表
CREATE TABLE IF NOT EXISTS public.land_zones (
    id text PRIMARY KEY,
    name_en text NOT NULL,
    name_zh text NOT NULL,
    description_en text,
    description_zh text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. 房源主表
CREATE TABLE IF NOT EXISTS public.properties (
    id text PRIMARY KEY,
    title_en text NOT NULL,
    title_zh text NOT NULL,
    description_en text,
    description_zh text,
    price_usd numeric(12,2),
    price_cny numeric(12,2),
    price_idr numeric(15,2),
    bedrooms integer,
    bathrooms integer,
    building_area numeric(10,2),
    land_area numeric(10,2),
    area_id text REFERENCES public.property_areas(id),
    type_id text REFERENCES public.property_types(id),
    status text DEFAULT 'available',
    ownership text DEFAULT 'leasehold',
    latitude numeric(10,8),
    longitude numeric(11,8),
    tags_en text[] DEFAULT '{}',
    tags_zh text[] DEFAULT '{}',
    amenities_en text[] DEFAULT '{}',
    amenities_zh text[] DEFAULT '{}',
    is_featured boolean DEFAULT false,
    is_published boolean DEFAULT true,
    build_year integer,
    land_zone_id text REFERENCES public.land_zones(id),
    leasehold_years integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 5. 房源图片表
CREATE TABLE IF NOT EXISTS public.property_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id text REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text,
    sort_order integer DEFAULT 0,
    is_main boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 6. 用户收藏映射表
CREATE TABLE IF NOT EXISTS public.user_favorites_map (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id text REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, property_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_properties_area_id ON public.properties(area_id);
CREATE INDEX IF NOT EXISTS idx_properties_type_id ON public.properties(type_id);
CREATE INDEX IF NOT EXISTS idx_properties_land_zone_id ON public.properties(land_zone_id);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON public.properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_is_published ON public.properties(is_published);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_sort_order ON public.property_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_user_favorites_map_user_id ON public.user_favorites_map(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_map_property_id ON public.user_favorites_map(property_id);