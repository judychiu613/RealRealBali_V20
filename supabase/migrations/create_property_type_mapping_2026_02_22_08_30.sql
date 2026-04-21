-- 创建新的房源类型映射表（包含一二级分类信息）
CREATE TABLE IF NOT EXISTS public.property_type_mapping_2026_02_22_08_30 (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_zh TEXT NOT NULL,
    category_en TEXT NOT NULL, -- 一级分类英文
    category_zh TEXT NOT NULL, -- 一级分类中文
    subcategory_en TEXT NOT NULL, -- 二级分类英文
    subcategory_zh TEXT NOT NULL, -- 二级分类中文
    description_en TEXT,
    description_zh TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用RLS
ALTER TABLE public.property_type_mapping_2026_02_22_08_30 ENABLE ROW LEVEL SECURITY;

-- 创建公共读取策略
CREATE POLICY "Allow public read access" ON public.property_type_mapping_2026_02_22_08_30 FOR SELECT USING (true);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_type_mapping_category ON public.property_type_mapping_2026_02_22_08_30(category_en);
CREATE INDEX IF NOT EXISTS idx_property_type_mapping_subcategory ON public.property_type_mapping_2026_02_22_08_30(subcategory_en);
CREATE INDEX IF NOT EXISTS idx_property_type_mapping_sort ON public.property_type_mapping_2026_02_22_08_30(sort_order);

-- 插入新的类型映射数据
INSERT INTO public.property_type_mapping_2026_02_22_08_30 (id, name_en, name_zh, category_en, category_zh, subcategory_en, subcategory_zh, description_en, description_zh, sort_order) VALUES
-- 别墅类型
('luxury_villa', 'Luxury Villa', '豪华别墅', 'Villa', '别墅', 'Luxury Villa', '豪华别墅', 'High-end luxury villas with premium amenities', '配备高端设施的豪华别墅', 1),
('beachfront_villa', 'Beachfront Villa', '海滨别墅', 'Villa', '别墅', 'Beachfront Villa', '海滨别墅', 'Villas with direct beach access', '直接海滩通道的别墅', 2),
('hillside_villa', 'Hillside Villa', '山坡别墅', 'Villa', '别墅', 'Hillside Villa', '山坡别墅', 'Villas with mountain or hill views', '山景或山坡别墅', 3),
('traditional_villa', 'Traditional Villa', '传统别墅', 'Villa', '别墅', 'Traditional Villa', '传统别墅', 'Traditional Balinese style villas', '传统巴厘岛风格别墅', 4),
('modern_villa', 'Modern Villa', '现代别墅', 'Villa', '别墅', 'Modern Villa', '现代别墅', 'Contemporary design villas', '现代设计别墅', 5),

-- 土地类型
('residential_land', 'Residential Land', '住宅用地', 'Land', '土地', 'Residential Land', '住宅用地', 'Land for residential development', '住宅开发用地', 11),
('commercial_land', 'Commercial Land', '商业用地', 'Land', '土地', 'Commercial Land', '商业用地', 'Land for commercial development', '商业开发用地', 12),
('agricultural_land', 'Agricultural Land', '农业用地', 'Land', '土地', 'Agricultural Land', '农业用地', 'Agricultural and farming land', '农业和耕作用地', 13),
('beachfront_land', 'Beachfront Land', '海滨用地', 'Land', '土地', 'Beachfront Land', '海滨用地', 'Land with beach access', '有海滩通道的土地', 14),
('investment_land', 'Investment Land', '投资用地', 'Land', '土地', 'Investment Land', '投资用地', 'Land for investment purposes', '投资目的用地', 15),

-- 商业类型
('hotel_property', 'Hotel', '酒店', 'Commercial', '商业', 'Hotel', '酒店', 'Hotels and resorts', '酒店和度假村', 21),
('restaurant_property', 'Restaurant', '餐厅', 'Commercial', '商业', 'Restaurant', '餐厅', 'Restaurants and cafes', '餐厅和咖啡厅', 22),
('retail_space', 'Retail Space', '零售空间', 'Commercial', '商业', 'Retail Space', '零售空间', 'Retail and shopping spaces', '零售和购物空间', 23),
('office_space', 'Office Space', '办公空间', 'Commercial', '商业', 'Office Space', '办公空间', 'Office buildings and spaces', '办公楼和办公空间', 24),
('warehouse_property', 'Warehouse', '仓库', 'Commercial', '商业', 'Warehouse', '仓库', 'Warehouse and storage facilities', '仓库和储存设施', 25)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    category_en = EXCLUDED.category_en,
    category_zh = EXCLUDED.category_zh,
    subcategory_en = EXCLUDED.subcategory_en,
    subcategory_zh = EXCLUDED.subcategory_zh,
    description_en = EXCLUDED.description_en,
    description_zh = EXCLUDED.description_zh,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();