-- 清理现有区域数据并重建新的市场分区结构
-- 首先临时禁用外键约束检查，更新房源到临时区域
UPDATE public.properties SET area_id = 'temp_area' WHERE area_id IS NOT NULL;

-- 清空现有区域数据
DELETE FROM public.property_areas_map;

-- ========== 插入一级分类（市场分区） ==========
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('west-coast', '西海岸核心区', 'West Coast', NULL),
('south-bukit', '南部悬崖区', 'South Bukit', NULL),
('ubud-central', '乌布及中部区域', 'Ubud & Central Bali', NULL),
('emerging-west', '西部新兴增长区', 'Emerging West', NULL),
('east-bali', '东巴厘岛', 'East Bali', NULL),
('north-bali', '北巴厘岛', 'North Bali', NULL);

-- ========== 插入二级区域 ==========

-- West Coast – 西海岸核心区
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('canggu', '苍古', 'Canggu', 'west-coast'),
('pererenan', '佩雷雷南', 'Pererenan', 'west-coast'),
('seseh', '塞塞', 'Seseh', 'west-coast'),
('cemagi', '切马吉', 'Cemagi', 'west-coast'),
('kerobokan', '克罗柏坎', 'Kerobokan', 'west-coast'),
('seminyak', '水明漾', 'Seminyak', 'west-coast'),
('kuta', '库塔', 'Kuta', 'west-coast'),
('legian', '雷吉安', 'Legian', 'west-coast');

-- South Bukit – 南部悬崖区
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('uluwatu', '乌鲁瓦图', 'Uluwatu', 'south-bukit'),
('pecatu', '佩卡图', 'Pecatu', 'south-bukit'),
('bingin', '宾金', 'Bingin', 'south-bukit'),
('ungasan', '乌干沙', 'Ungasan', 'south-bukit'),
('jimbaran', '金巴兰', 'Jimbaran', 'south-bukit'),
('nusa-dua', '努沙杜瓦', 'Nusa Dua', 'south-bukit'),
('benoa', '贝诺阿', 'Benoa', 'south-bukit');

-- Ubud & Central Bali – 乌布及中部区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('ubud-center', '乌布核心区', 'Ubud Center', 'ubud-central'),
('sayan', '萨彦', 'Sayan', 'ubud-central'),
('mas', '马斯', 'Mas', 'ubud-central'),
('pejeng', '佩姜', 'Pejeng', 'ubud-central'),
('lodtunduh', '洛顿图', 'Lodtunduh', 'ubud-central'),
('tegalalang', '德格拉朗', 'Tegalalang', 'ubud-central'),
('tampaksiring', '坦帕克西林', 'Tampaksiring', 'ubud-central'),
('payangan', '帕洋岸', 'Payangan', 'ubud-central');

-- Emerging West – 西部新兴增长区
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('kedungu', '克东古', 'Kedungu', 'emerging-west'),
('nyanyi', '尼亚尼', 'Nyanyi', 'emerging-west'),
('kaba-kaba', '卡巴卡巴', 'Kaba-Kaba', 'emerging-west'),
('cepaka', '切帕卡', 'Cepaka', 'emerging-west'),
('tanah-lot', '海神庙', 'Tanah Lot', 'emerging-west'),
('balian', '巴利安', 'Balian', 'emerging-west');

-- East Bali – 东巴厘岛
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('candidasa', '坎迪达萨', 'Candidasa', 'east-bali'),
('manggis', '曼吉斯', 'Manggis', 'east-bali'),
('amed', '阿湄', 'Amed', 'east-bali');

-- North Bali – 北巴厘岛
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('lovina', '罗威纳', 'Lovina', 'north-bali'),
('munduk', '蒙杜克', 'Munduk', 'north-bali'),
('pemuteran', '佩母德兰', 'Pemuteran', 'north-bali');

-- 验证新的区域结构
SELECT 
  id,
  name_zh,
  name_en,
  parent_id,
  CASE 
    WHEN parent_id IS NULL THEN '一级分类（市场分区）'
    ELSE '二级区域'
  END as level
FROM public.property_areas_map 
ORDER BY parent_id NULLS FIRST, id;