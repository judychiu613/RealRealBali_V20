-- 重命名映射表并重新组织表结构

-- 1. 创建新的映射表结构
CREATE TABLE IF NOT EXISTS public.land_zones_map (
    id text PRIMARY KEY,
    name_en text NOT NULL,
    name_zh text NOT NULL,
    description_en text,
    description_zh text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.property_areas_map (
    id text PRIMARY KEY,
    name_en text NOT NULL,
    name_zh text NOT NULL,
    description_en text,
    description_zh text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.property_types_map (
    id text PRIMARY KEY,
    name_en text NOT NULL,
    name_zh text NOT NULL,
    description_en text,
    description_zh text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. 迁移数据到新的映射表
INSERT INTO public.land_zones_map (id, name_en, name_zh, description_en, description_zh, sort_order, created_at, updated_at)
SELECT id, name_en, name_zh, description_en, description_zh, sort_order, created_at, updated_at
FROM public.land_zones
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    description_en = EXCLUDED.description_en,
    description_zh = EXCLUDED.description_zh,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

INSERT INTO public.property_areas_map (id, name_en, name_zh, description_en, description_zh, sort_order, created_at, updated_at)
SELECT id, name_en, name_zh, description_en, description_zh, sort_order, created_at, updated_at
FROM public.property_areas
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    description_en = EXCLUDED.description_en,
    description_zh = EXCLUDED.description_zh,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

INSERT INTO public.property_types_map (id, name_en, name_zh, description_en, description_zh, sort_order, created_at, updated_at)
SELECT id, name_en, name_zh, description_en, description_zh, sort_order, created_at, updated_at
FROM public.property_types
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    description_en = EXCLUDED.description_en,
    description_zh = EXCLUDED.description_zh,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

-- 3. 验证数据迁移
SELECT 
    'land_zones_map' as table_name, COUNT(*) as count FROM public.land_zones_map
UNION ALL
SELECT 
    'property_areas_map' as table_name, COUNT(*) as count FROM public.property_areas_map
UNION ALL
SELECT 
    'property_types_map' as table_name, COUNT(*) as count FROM public.property_types_map;