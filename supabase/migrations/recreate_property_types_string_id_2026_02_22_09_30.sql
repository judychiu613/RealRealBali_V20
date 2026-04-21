-- 删除现有的外键约束
ALTER TABLE public.properties_final_2026_02_21_17_30 
DROP CONSTRAINT IF EXISTS properties_simple_type_fkey;

-- 删除旧的类型表
DROP TABLE IF EXISTS public.property_types_simple_2026_02_22_09_00 CASCADE;

-- 创建新的房源类型表，使用英文字符串作为ID
CREATE TABLE public.property_types_final_2026_02_22_09_30 (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    description_en TEXT,
    description_zh TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用RLS
ALTER TABLE public.property_types_final_2026_02_22_09_30 ENABLE ROW LEVEL SECURITY;

-- 创建公共读取策略
CREATE POLICY "Allow public read access" ON public.property_types_final_2026_02_22_09_30 FOR SELECT USING (true);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_types_final_sort ON public.property_types_final_2026_02_22_09_30(sort_order);

-- 插入3个房源类型，使用英文字符串作为ID
INSERT INTO public.property_types_final_2026_02_22_09_30 (id, name_en, name_zh, description_en, description_zh, sort_order) VALUES
('villa', 'Villa', '别墅', 'Residential villas and houses', '住宅别墅和房屋', 1),
('land', 'Land', '土地', 'Land plots and development opportunities', '土地地块和开发机会', 2),
('commercial', 'Commercial', '商业', 'Commercial properties and business opportunities', '商业物业和商业机会', 3);