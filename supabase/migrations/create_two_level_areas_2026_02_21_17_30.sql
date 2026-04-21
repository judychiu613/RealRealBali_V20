-- 重新设计两级区域结构

-- 创建新的两级区域表
CREATE TABLE IF NOT EXISTS public.property_areas_final_2026_02_21_17_30 (
  id VARCHAR(50) PRIMARY KEY, -- 使用 "seminyak" 或 "seminyak-beach" 格式
  parent_id VARCHAR(50) REFERENCES public.property_areas_final_2026_02_21_17_30(id), -- 父级区域ID
  level INTEGER NOT NULL DEFAULT 1, -- 1=一级区域, 2=二级区域
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入一级区域数据
INSERT INTO public.property_areas_final_2026_02_21_17_30 (
  id, parent_id, level, name_en, name_zh, description_en, description_zh, sort_order
) VALUES
-- 一级区域
('seminyak', NULL, 1, 'Seminyak', '水明漾', 'Upscale beachside town known for high-end dining and shopping', '高档海滨小镇，以高端餐饮和购物闻名', 1),
('canggu', NULL, 1, 'Canggu', '仓古', 'Trendy surf town with beach clubs and cafes', '时尚冲浪小镇，拥有海滩俱乐部和咖啡厅', 2),
('uluwatu', NULL, 1, 'Uluwatu', '乌鲁瓦图', 'Clifftop area famous for surfing and stunning sunsets', '悬崖顶区域，以冲浪和壮丽日落闻名', 3),
('ubud', NULL, 1, 'Ubud', '乌布', 'Cultural heart of Bali with rice terraces and art scene', '巴厘岛文化中心，拥有稻田梯田和艺术氛围', 4),
('sanur', NULL, 1, 'Sanur', '萨努尔', 'Quiet beachside town perfect for families', '安静的海滨小镇，适合家庭居住', 5),
('denpasar', NULL, 1, 'Denpasar', '登巴萨', 'Capital city with urban amenities', '首都城市，拥有城市便利设施', 6),
('jimbaran', NULL, 1, 'Jimbaran', '金巴兰', 'Famous for seafood restaurants and beautiful bay', '以海鲜餐厅和美丽海湾闻名', 7),
('nusa-dua', NULL, 1, 'Nusa Dua', '努沙杜瓦', 'Luxury resort area with pristine beaches', '豪华度假区，拥有原始海滩', 8),
('kuta', NULL, 1, 'Kuta', '库塔', 'Popular tourist area near the airport', '机场附近的热门旅游区', 9),
('tabanan', NULL, 1, 'Tabanan', '塔巴南', 'Rural area with traditional Balinese culture', '拥有传统巴厘岛文化的乡村地区', 10);

-- 插入二级区域数据
INSERT INTO public.property_areas_final_2026_02_21_17_30 (
  id, parent_id, level, name_en, name_zh, description_en, description_zh, sort_order
) VALUES
-- Seminyak 二级区域
('seminyak-beach', 'seminyak', 2, 'Seminyak Beach', '水明漾海滩', 'Beachfront area with luxury resorts', '海滨区域，拥有豪华度假村', 1),
('seminyak-center', 'seminyak', 2, 'Seminyak Center', '水明漾中心', 'Central area with shopping and dining', '中心区域，拥有购物和餐饮', 2),
('petitenget', 'seminyak', 2, 'Petitenget', '佩蒂滕格特', 'Upscale residential area', '高档住宅区', 3),

-- Canggu 二级区域
('echo-beach', 'canggu', 2, 'Echo Beach', '回音海滩', 'Popular surf spot with beach clubs', '热门冲浪点，拥有海滩俱乐部', 1),
('berawa', 'canggu', 2, 'Berawa', '贝拉瓦', 'Trendy area with cafes and villas', '时尚区域，拥有咖啡厅和别墅', 2),
('pererenan', 'canggu', 2, 'Pererenan', '佩雷雷南', 'Quiet residential area', '安静的住宅区', 3),

-- Uluwatu 二级区域
('bingin', 'uluwatu', 2, 'Bingin', '宾金', 'Clifftop location with ocean views', '悬崖顶位置，拥有海景', 1),
('padang-padang', 'uluwatu', 2, 'Padang Padang', '巴东巴东', 'Famous surf break area', '著名的冲浪点区域', 2),
('uluwatu-temple', 'uluwatu', 2, 'Uluwatu Temple Area', '乌鲁瓦图寺庙区', 'Near the famous temple', '靠近著名寺庙', 3),

-- Ubud 二级区域
('ubud-center', 'ubud', 2, 'Ubud Center', '乌布中心', 'Town center with markets and restaurants', '市中心，拥有市场和餐厅', 1),
('tegallalang', 'ubud', 2, 'Tegallalang', '德格拉朗', 'Famous rice terrace area', '著名的稻田梯田区', 2),
('mas', 'ubud', 2, 'Mas', '马斯', 'Traditional woodcarving village', '传统木雕村', 3);

-- 验证区域结构
SELECT 
  'Area Structure Check' as check_type,
  COUNT(*) as total_areas,
  COUNT(CASE WHEN level = 1 THEN 1 END) as level_1_areas,
  COUNT(CASE WHEN level = 2 THEN 1 END) as level_2_areas
FROM public.property_areas_final_2026_02_21_17_30;