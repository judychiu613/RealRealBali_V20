-- Emerging West – 西部新兴增长区的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('kedungu', '克东古', 'Kedungu', 'emerging-west'),
('nyanyi', '尼亚尼', 'Nyanyi', 'emerging-west'),
('kaba-kaba', '卡巴卡巴', 'Kaba-Kaba', 'emerging-west'),
('cepaka', '切帕卡', 'Cepaka', 'emerging-west'),
('tanah-lot', '海神庙', 'Tanah Lot', 'emerging-west'),
('balian', '巴利安', 'Balian', 'emerging-west');

-- East Bali – 东巴厘岛的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('candidasa', '坎迪达萨', 'Candidasa', 'east-bali'),
('manggis', '曼吉斯', 'Manggis', 'east-bali'),
('amed', '阿湄', 'Amed', 'east-bali');

-- North Bali – 北巴厘岛的二级区域
INSERT INTO public.property_areas_map (id, name_zh, name_en, parent_id) VALUES
('lovina', '罗威纳', 'Lovina', 'north-bali'),
('munduk', '蒙杜克', 'Munduk', 'north-bali'),
('pemuteran', '佩母德兰', 'Pemuteran', 'north-bali');

-- 查看完整的新区域结构
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