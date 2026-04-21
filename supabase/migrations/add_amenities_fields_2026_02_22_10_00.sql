-- 添加特色设施字段到房源表
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD COLUMN amenities_en text[] DEFAULT '{}',
ADD COLUMN amenities_zh text[] DEFAULT '{}';

-- 为现有房源添加示例特色设施数据
UPDATE public.properties_final_2026_02_21_17_30 
SET 
  amenities_en = CASE 
    WHEN id = 'prop-001' THEN ARRAY['Private Pool', 'Ocean View', 'Garden', 'Parking', 'WiFi', 'Air Conditioning']
    WHEN id = 'prop-002' THEN ARRAY['Swimming Pool', 'Gym', 'Security', 'Balcony', 'Kitchen', 'Laundry']
    WHEN id = 'prop-003' THEN ARRAY['Beachfront', 'Terrace', 'BBQ Area', 'Storage', 'Utilities', 'Furnished']
    WHEN id = 'prop-004' THEN ARRAY['Infinity Pool', 'Spa', 'Wine Cellar', 'Home Theater', 'Smart Home', 'Elevator']
    WHEN id = 'prop-005' THEN ARRAY['Rooftop Deck', 'Jacuzzi', 'Fire Pit', 'Outdoor Kitchen', 'Guest House', 'Solar Panels']
    WHEN id = 'prop-006' THEN ARRAY['Private Beach', 'Boat Dock', 'Tennis Court', 'Staff Quarters', 'Generator', 'CCTV']
    WHEN id = 'prop-007' THEN ARRAY['Tropical Garden', 'Koi Pond', 'Gazebo', 'Outdoor Shower', 'Meditation Area', 'Organic Garden']
    WHEN id = 'prop-008' THEN ARRAY['Cliff Edge', 'Sunset View', 'Yoga Pavilion', 'Library', 'Art Studio', 'Wine Storage']
    WHEN id = 'prop-009' THEN ARRAY['Rice Field View', 'Traditional Architecture', 'Natural Pool', 'Bamboo Features', 'Eco-Friendly', 'Wellness Center']
    WHEN id = 'prop-010' THEN ARRAY['Mountain View', 'Hiking Trails', 'Organic Farm', 'Greenhouse', 'Workshop', 'Observatory']
    ELSE ARRAY['Swimming Pool', 'Garden', 'Parking', 'WiFi', 'Air Conditioning', 'Security']
  END,
  amenities_zh = CASE 
    WHEN id = 'prop-001' THEN ARRAY['私人泳池', '海景', '花园', '停车场', '无线网络', '空调']
    WHEN id = 'prop-002' THEN ARRAY['游泳池', '健身房', '安保', '阳台', '厨房', '洗衣房']
    WHEN id = 'prop-003' THEN ARRAY['海滨', '露台', '烧烤区', '储物间', '公用设施', '精装修']
    WHEN id = 'prop-004' THEN ARRAY['无边泳池', '水疗中心', '酒窖', '家庭影院', '智能家居', '电梯']
    WHEN id = 'prop-005' THEN ARRAY['屋顶平台', '按摩浴缸', '火坑', '户外厨房', '客房', '太阳能板']
    WHEN id = 'prop-006' THEN ARRAY['私人海滩', '船坞', '网球场', '员工宿舍', '发电机', '监控系统']
    WHEN id = 'prop-007' THEN ARRAY['热带花园', '锦鲤池', '凉亭', '户外淋浴', '冥想区', '有机花园']
    WHEN id = 'prop-008' THEN ARRAY['悬崖边', '日落景观', '瑜伽亭', '图书馆', '艺术工作室', '酒类储藏']
    WHEN id = 'prop-009' THEN ARRAY['稻田景观', '传统建筑', '天然泳池', '竹制装饰', '生态友好', '健康中心']
    WHEN id = 'prop-010' THEN ARRAY['山景', '徒步小径', '有机农场', '温室', '工作坊', '天文台']
    ELSE ARRAY['游泳池', '花园', '停车场', '无线网络', '空调', '安保']
  END;

-- 验证数据更新
SELECT id, amenities_en, amenities_zh 
FROM public.properties_final_2026_02_21_17_30 
WHERE id IN ('prop-001', 'prop-002', 'prop-003')
ORDER BY id;