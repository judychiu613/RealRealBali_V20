-- 创建简化的房源类型表（只有一级分类）
CREATE TABLE IF NOT EXISTS public.property_types_simple_2026_02_22_09_00 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    description_en TEXT,
    description_zh TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用RLS
ALTER TABLE public.property_types_simple_2026_02_22_09_00 ENABLE ROW LEVEL SECURITY;

-- 创建公共读取策略
CREATE POLICY "Allow public read access" ON public.property_types_simple_2026_02_22_09_00 FOR SELECT USING (true);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_types_simple_sort ON public.property_types_simple_2026_02_22_09_00(sort_order);

-- 插入3个一级分类数据
INSERT INTO public.property_types_simple_2026_02_22_09_00 (name_en, name_zh, description_en, description_zh, sort_order) VALUES
('Villa', '别墅', 'Residential villas and houses', '住宅别墅和房屋', 1),
('Land', '土地', 'Land plots and development opportunities', '土地地块和开发机会', 2),
('Commercial', '商业', 'Commercial properties and business opportunities', '商业物业和商业机会', 3)
ON CONFLICT (name_en) DO UPDATE SET
    name_zh = EXCLUDED.name_zh,
    description_en = EXCLUDED.description_en,
    description_zh = EXCLUDED.description_zh,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();