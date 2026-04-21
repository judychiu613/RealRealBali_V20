-- 添加parent_id字段来管理一二级区域关系
ALTER TABLE public.property_areas_map 
ADD COLUMN IF NOT EXISTS parent_id TEXT REFERENCES public.property_areas_map(id);

-- 清理现有数据，重新建立正确的一二级区域关系
DELETE FROM public.property_areas_map;

-- 插入一级区域（parent_id为NULL）
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('seminyak', '水明漾', 'Seminyak', NULL),
('canggu', '仓古', 'Canggu', NULL),
('ubud', '乌布', 'Ubud', NULL),
('uluwatu', '乌鲁瓦图', 'Uluwatu', NULL),
('jimbaran', '金巴兰', 'Jimbaran', NULL),
('sanur', '沙努尔', 'Sanur', NULL);

-- 插入二级区域（parent_id指向对应的一级区域）
-- 水明漾的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('seminyak-beach', '水明漾海滩', 'Seminyak Beach', 'seminyak'),
('petitenget', '佩蒂滕格街', 'Petitenget Street', 'seminyak'),
('oberoi', '奥贝罗伊街', 'Oberoi Street', 'seminyak'),
('kayu-aya', '卡优阿雅街', 'Kayu Aya Street', 'seminyak');

-- 仓古的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('echo-beach', '回声海滩', 'Echo Beach', 'canggu'),
('berawa', '贝拉瓦', 'Berawa', 'canggu'),
('batu-bolong', '巴图博隆', 'Batu Bolong', 'canggu'),
('pererenan', '佩雷雷南', 'Pererenan', 'canggu');

-- 乌布的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('ubud-center', '乌布中心', 'Ubud Center', 'ubud'),
('tegallalang', '德格拉朗', 'Tegallalang', 'ubud'),
('mas', '马斯村', 'Mas Village', 'ubud'),
('payangan', '帕雅干', 'Payangan', 'ubud');

-- 乌鲁瓦图的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('bingin', '宾金', 'Bingin', 'uluwatu'),
('padang-padang', '帕丹帕丹', 'Padang Padang', 'uluwatu'),
('dreamland', '梦幻海滩', 'Dreamland', 'uluwatu'),
('suluban', '苏鲁班', 'Suluban', 'uluwatu');

-- 金巴兰的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('jimbaran-bay', '金巴兰海湾', 'Jimbaran Bay', 'jimbaran'),
('kedonganan', '克东南', 'Kedonganan', 'jimbaran'),
('ungasan', '乌加桑', 'Ungasan', 'jimbaran');

-- 沙努尔的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('sanur-beach', '沙努尔海滩', 'Sanur Beach', 'sanur'),
('sindhu', '辛杜', 'Sindhu', 'sanur'),
('mertasari', '默塔萨里', 'Mertasari', 'sanur');

-- 验证结果
SELECT 
  id,
  name_zh,
  name_en,
  parent_id,
  CASE 
    WHEN parent_id IS NULL THEN '一级区域'
    ELSE '二级区域'
  END as level
FROM public.property_areas_map 
ORDER BY parent_id NULLS FIRST, id;