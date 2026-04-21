-- 创建一级分类表（别墅/土地/商业）
CREATE TABLE IF NOT EXISTS public.property_categories_2026_02_22_08_00 (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    description_en TEXT,
    description_zh TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建二级分类表（子项目）
CREATE TABLE IF NOT EXISTS public.property_subcategories_2026_02_22_08_00 (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.property_categories_2026_02_22_08_00(id) ON DELETE CASCADE,
    name_en TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    description_en TEXT,
    description_zh TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用RLS
ALTER TABLE public.property_categories_2026_02_22_08_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_subcategories_2026_02_22_08_00 ENABLE ROW LEVEL SECURITY;

-- 创建公共读取策略
CREATE POLICY "Allow public read access" ON public.property_categories_2026_02_22_08_00 FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.property_subcategories_2026_02_22_08_00 FOR SELECT USING (true);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_categories_sort ON public.property_categories_2026_02_22_08_00(sort_order);
CREATE INDEX IF NOT EXISTS idx_property_subcategories_category ON public.property_subcategories_2026_02_22_08_00(category_id);
CREATE INDEX IF NOT EXISTS idx_property_subcategories_sort ON public.property_subcategories_2026_02_22_08_00(sort_order);

-- 插入一级分类数据
INSERT INTO public.property_categories_2026_02_22_08_00 (id, name_en, name_zh, description_en, description_zh, sort_order) VALUES
('villa', 'Villa', '别墅', 'Luxury residential properties', '豪华住宅物业', 1),
('land', 'Land', '土地', 'Land and development opportunities', '土地和开发机会', 2),
('commercial', 'Commercial', '商业', 'Commercial and investment properties', '商业和投资物业', 3)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    description_en = EXCLUDED.description_en,
    description_zh = EXCLUDED.description_zh,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- 插入二级分类数据
INSERT INTO public.property_subcategories_2026_02_22_08_00 (id, category_id, name_en, name_zh, description_en, description_zh, sort_order) VALUES
-- 别墅子类
('villa_luxury', 'villa', 'Luxury Villa', '豪华别墅', 'High-end luxury villas', '高端豪华别墅', 1),
('villa_beachfront', 'villa', 'Beachfront Villa', '海滨别墅', 'Villas with direct beach access', '直接海滩通道的别墅', 2),
('villa_hillside', 'villa', 'Hillside Villa', '山坡别墅', 'Villas with mountain or hill views', '山景或山坡别墅', 3),
('villa_traditional', 'villa', 'Traditional Villa', '传统别墅', 'Traditional Balinese style villas', '传统巴厘岛风格别墅', 4),
('villa_modern', 'villa', 'Modern Villa', '现代别墅', 'Contemporary design villas', '现代设计别墅', 5),

-- 土地子类
('land_residential', 'land', 'Residential Land', '住宅用地', 'Land for residential development', '住宅开发用地', 1),
('land_commercial', 'land', 'Commercial Land', '商业用地', 'Land for commercial development', '商业开发用地', 2),
('land_agricultural', 'land', 'Agricultural Land', '农业用地', 'Agricultural and farming land', '农业和耕作用地', 3),
('land_beachfront', 'land', 'Beachfront Land', '海滨用地', 'Land with beach access', '有海滩通道的土地', 4),
('land_investment', 'land', 'Investment Land', '投资用地', 'Land for investment purposes', '投资目的用地', 5),

-- 商业子类
('commercial_hotel', 'commercial', 'Hotel', '酒店', 'Hotels and resorts', '酒店和度假村', 1),
('commercial_restaurant', 'commercial', 'Restaurant', '餐厅', 'Restaurants and cafes', '餐厅和咖啡厅', 2),
('commercial_retail', 'commercial', 'Retail Space', '零售空间', 'Retail and shopping spaces', '零售和购物空间', 3),
('commercial_office', 'commercial', 'Office Space', '办公空间', 'Office buildings and spaces', '办公楼和办公空间', 4),
('commercial_warehouse', 'commercial', 'Warehouse', '仓库', 'Warehouse and storage facilities', '仓库和储存设施', 5)
ON CONFLICT (id) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    description_en = EXCLUDED.description_en,
    description_zh = EXCLUDED.description_zh,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();