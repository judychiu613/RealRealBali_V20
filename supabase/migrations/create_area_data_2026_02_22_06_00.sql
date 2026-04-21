-- 清空并重新插入区域数据
DELETE FROM public.property_areas_final_2026_02_21_17_30;

-- 插入巴厘岛主要区域数据
INSERT INTO public.property_areas_final_2026_02_21_17_30 (id, name_en, name_zh, description_en, description_zh) VALUES
('canggu', 'Canggu', '仓古', 'Trendy beach town known for surfing and vibrant nightlife', '以冲浪和充满活力的夜生活而闻名的时尚海滨小镇'),
('seminyak', 'Seminyak', '水明漾', 'Upscale beach resort area with luxury hotels and fine dining', '拥有豪华酒店和精致餐饮的高档海滨度假区'),
('ubud', 'Ubud', '乌布', 'Cultural heart of Bali with lush rice terraces and art galleries', '巴厘岛的文化中心，拥有郁郁葱葱的梯田和艺术画廊'),
('uluwatu', 'Uluwatu', '乌鲁瓦图', 'Clifftop location with stunning ocean views and world-class surfing', '悬崖顶位置，拥有令人惊叹的海景和世界级的冲浪'),
('sanur', 'Sanur', '萨努尔', 'Peaceful beach town with calm waters and traditional Balinese culture', '宁静的海滨小镇，拥有平静的海水和传统的巴厘岛文化'),
('nusa_dua', 'Nusa Dua', '努沙杜瓦', 'Premium resort enclave with pristine beaches and luxury amenities', '拥有原始海滩和豪华设施的优质度假村飞地'),
('jimbaran', 'Jimbaran', '金巴兰', 'Famous for seafood restaurants and beautiful sunset views', '以海鲜餐厅和美丽的日落景色而闻名'),
('denpasar', 'Denpasar', '登巴萨', 'Capital city with cultural attractions and local markets', '拥有文化景点和当地市场的首都城市');

-- 验证插入结果
SELECT * FROM public.property_areas_final_2026_02_21_17_30;