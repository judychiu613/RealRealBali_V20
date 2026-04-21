-- 检查type_id字段的数据类型
SELECT column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30' 
AND column_name = 'type_id';

-- 修改映射表的ID为UUID类型
ALTER TABLE public.property_type_mapping_2026_02_22_08_30 
ALTER COLUMN id TYPE UUID USING gen_random_uuid();

-- 重新插入数据，使用UUID
TRUNCATE public.property_type_mapping_2026_02_22_08_30;

INSERT INTO public.property_type_mapping_2026_02_22_08_30 (id, name_en, name_zh, category_en, category_zh, subcategory_en, subcategory_zh, description_en, description_zh, sort_order) VALUES
-- 别墅类型
(gen_random_uuid(), 'Luxury Villa', '豪华别墅', 'Villa', '别墅', 'Luxury Villa', '豪华别墅', 'High-end luxury villas with premium amenities', '配备高端设施的豪华别墅', 1),
(gen_random_uuid(), 'Beachfront Villa', '海滨别墅', 'Villa', '别墅', 'Beachfront Villa', '海滨别墅', 'Villas with direct beach access', '直接海滩通道的别墅', 2),
(gen_random_uuid(), 'Hillside Villa', '山坡别墅', 'Villa', '别墅', 'Hillside Villa', '山坡别墅', 'Villas with mountain or hill views', '山景或山坡别墅', 3),
(gen_random_uuid(), 'Traditional Villa', '传统别墅', 'Villa', '别墅', 'Traditional Villa', '传统别墅', 'Traditional Balinese style villas', '传统巴厘岛风格别墅', 4),
(gen_random_uuid(), 'Modern Villa', '现代别墅', 'Villa', '别墅', 'Modern Villa', '现代别墅', 'Contemporary design villas', '现代设计别墅', 5),

-- 土地类型
(gen_random_uuid(), 'Residential Land', '住宅用地', 'Land', '土地', 'Residential Land', '住宅用地', 'Land for residential development', '住宅开发用地', 11),
(gen_random_uuid(), 'Commercial Land', '商业用地', 'Land', '土地', 'Commercial Land', '商业用地', 'Land for commercial development', '商业开发用地', 12),
(gen_random_uuid(), 'Agricultural Land', '农业用地', 'Land', '土地', 'Agricultural Land', '农业用地', 'Agricultural and farming land', '农业和耕作用地', 13),
(gen_random_uuid(), 'Beachfront Land', '海滨用地', 'Land', '土地', 'Beachfront Land', '海滨用地', 'Land with beach access', '有海滩通道的土地', 14),
(gen_random_uuid(), 'Investment Land', '投资用地', 'Land', '土地', 'Investment Land', '投资用地', 'Land for investment purposes', '投资目的用地', 15),

-- 商业类型
(gen_random_uuid(), 'Hotel', '酒店', 'Commercial', '商业', 'Hotel', '酒店', 'Hotels and resorts', '酒店和度假村', 21),
(gen_random_uuid(), 'Restaurant', '餐厅', 'Commercial', '商业', 'Restaurant', '餐厅', 'Restaurants and cafes', '餐厅和咖啡厅', 22),
(gen_random_uuid(), 'Retail Space', '零售空间', 'Commercial', '商业', 'Retail Space', '零售空间', 'Retail and shopping spaces', '零售和购物空间', 23),
(gen_random_uuid(), 'Office Space', '办公空间', 'Commercial', '商业', 'Office Space', '办公空间', 'Office buildings and spaces', '办公楼和办公空间', 24),
(gen_random_uuid(), 'Warehouse', '仓库', 'Commercial', '商业', 'Warehouse', '仓库', 'Warehouse and storage facilities', '仓库和储存设施', 25);