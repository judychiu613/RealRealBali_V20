-- 创建房产标签翻译表
CREATE TABLE IF NOT EXISTS public.property_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_key TEXT NOT NULL UNIQUE, -- 标签的唯一标识符
  name_zh TEXT NOT NULL, -- 中文名称
  name_en TEXT NOT NULL, -- 英文名称
  description_zh TEXT, -- 中文描述（可选）
  description_en TEXT, -- 英文描述（可选）
  category TEXT DEFAULT 'general', -- 标签分类（如：location, feature, amenity等）
  is_active BOOLEAN DEFAULT true, -- 是否启用
  sort_order INTEGER DEFAULT 0, -- 排序顺序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_tags_tag_key ON public.property_tags(tag_key);
CREATE INDEX IF NOT EXISTS idx_property_tags_category ON public.property_tags(category);
CREATE INDEX IF NOT EXISTS idx_property_tags_active ON public.property_tags(is_active);
CREATE INDEX IF NOT EXISTS idx_property_tags_sort_order ON public.property_tags(sort_order);

-- 启用RLS
ALTER TABLE public.property_tags ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略：所有人可以查看活跃的标签
CREATE POLICY "Anyone can view active tags" ON public.property_tags
  FOR SELECT USING (is_active = true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_property_tags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_property_tags_updated_at_trigger
  BEFORE UPDATE ON public.property_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_property_tags_updated_at();

-- 插入现有的标签数据（包含英文翻译）
INSERT INTO public.property_tags (tag_key, name_zh, name_en, category, sort_order) VALUES
-- 位置特色
('beach_500m', '靠海滩500米', 'Within 500m of Beach', 'location', 1),
('ocean_view', '海景房', 'Ocean View', 'location', 2),
('nature_view', '自然风景房', 'Nature View', 'location', 3),
('private_beach', '私人沙滩', 'Private Beach', 'location', 4),
('mountain_view', '山景房', 'Mountain View', 'location', 5),
('rice_field_view', '稻田景观', 'Rice Field View', 'location', 6),
('city_center', '市中心', 'City Center', 'location', 7),
('lake_view', '湖景房', 'Lake View', 'location', 8),

-- 设施特色
('golf_course', '高尔夫球场', 'Golf Course', 'amenity', 10),
('hot_spring_resort', '温泉度假村', 'Hot Spring Resort', 'amenity', 11),
('eco_building', '生态建筑', 'Eco Building', 'amenity', 12),
('yoga_space', '瑜伽空间', 'Yoga Space', 'amenity', 13),
('surfing', '冲浪', 'Surfing', 'amenity', 14),
('private_garden', '私人花园', 'Private Garden', 'amenity', 15),
('private_dock', '私人码头', 'Private Dock', 'amenity', 16),
('helipad', '直升机停机坪', 'Helipad', 'amenity', 17),
('private_waterfall', '私人瀑布', 'Private Waterfall', 'amenity', 18),
('infinity_pool', '无边际泳池', 'Infinity Pool', 'amenity', 19),
('butler_service', '管家服务', 'Butler Service', 'amenity', 20),
('art_studio', '艺术工作室', 'Art Studio', 'amenity', 21),
('high_ceiling', '高天花板', 'High Ceiling', 'feature', 22),
('water_sports', '水上运动', 'Water Sports', 'amenity', 23),
('zen_garden', '禅意花园', 'Zen Garden', 'amenity', 24),
('tea_room', '茶室', 'Tea Room', 'amenity', 25),
('historic_building', '历史建筑', 'Historic Building', 'feature', 26),
('private_museum', '私人博物馆', 'Private Museum', 'amenity', 27),

-- 其他特色（根据现有数据补充）
('spa_wellness', '水疗养生', 'Spa & Wellness', 'amenity', 30),
('fitness_center', '健身中心', 'Fitness Center', 'amenity', 31),
('wine_cellar', '酒窖', 'Wine Cellar', 'amenity', 32),
('home_theater', '家庭影院', 'Home Theater', 'amenity', 33),
('smart_home', '智能家居', 'Smart Home', 'feature', 34),
('solar_power', '太阳能发电', 'Solar Power', 'feature', 35),
('organic_garden', '有机花园', 'Organic Garden', 'amenity', 36),
('meditation_space', '冥想空间', 'Meditation Space', 'amenity', 37),
('library', '图书馆', 'Library', 'amenity', 38),
('chef_kitchen', '主厨厨房', 'Chef Kitchen', 'feature', 39);

-- 创建获取标签的函数
CREATE OR REPLACE FUNCTION get_property_tags(language_code TEXT DEFAULT 'zh')
RETURNS TABLE (
  tag_key TEXT,
  name TEXT,
  category TEXT,
  sort_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.tag_key,
    CASE 
      WHEN language_code = 'en' THEN pt.name_en
      ELSE pt.name_zh
    END as name,
    pt.category,
    pt.sort_order
  FROM public.property_tags pt
  WHERE pt.is_active = true
  ORDER BY pt.sort_order, pt.name_zh;
END;
$$ LANGUAGE plpgsql;