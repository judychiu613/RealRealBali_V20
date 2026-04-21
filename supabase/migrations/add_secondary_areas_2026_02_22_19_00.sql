-- 添加水明漾(Seminyak)的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en) VALUES
('seminyak-beach', '水明漾海滩', 'Seminyak Beach'),
('petitenget', '佩蒂滕格街', 'Petitenget Street'),
('oberoi', '奥贝罗伊街', 'Oberoi Street'),
('kayu-aya', '卡优阿雅街', 'Kayu Aya Street');

-- 添加仓古(Canggu)的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en) VALUES
('echo-beach', '回声海滩', 'Echo Beach'),
('berawa', '贝拉瓦', 'Berawa'),
('batu-bolong', '巴图博隆', 'Batu Bolong'),
('pererenan', '佩雷雷南', 'Pererenan');

-- 添加乌布(Ubud)的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en) VALUES
('ubud-center', '乌布中心', 'Ubud Center'),
('tegallalang', '德格拉朗', 'Tegallalang'),
('mas', '马斯村', 'Mas Village'),
('payangan', '帕雅干', 'Payangan');

-- 添加乌鲁瓦图(Uluwatu)的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en) VALUES
('bingin', '宾金', 'Bingin'),
('padang-padang', '帕丹帕丹', 'Padang Padang'),
('dreamland', '梦幻海滩', 'Dreamland'),
('suluban', '苏鲁班', 'Suluban');

-- 添加金巴兰(Jimbaran)的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en) VALUES
('jimbaran-bay', '金巴兰海湾', 'Jimbaran Bay'),
('kedonganan', '克东南', 'Kedonganan'),
('ungasan', '乌加桑', 'Ungasan');

-- 添加沙努尔(Sanur)的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en) VALUES
('sanur-beach', '沙努尔海滩', 'Sanur Beach'),
('sindhu', '辛杜', 'Sindhu'),
('mertasari', '默塔萨里', 'Mertasari');

-- 查看添加后的结果
SELECT COUNT(*) as total_areas FROM public.property_areas_map;