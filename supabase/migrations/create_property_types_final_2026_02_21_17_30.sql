-- 重新创建房产类型表以支持最终版本

-- 创建房产类型表
CREATE TABLE IF NOT EXISTS public.property_types_final_2026_02_21_17_30 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入房产类型数据
INSERT INTO public.property_types_final_2026_02_21_17_30 (
  name_en, name_zh, slug, description_en, description_zh, sort_order
) VALUES
('Luxury Villa', '豪华别墅', 'luxury-villa', 'High-end luxury villa with premium amenities', '配备高端设施的豪华别墅', 1),
('Beachfront Villa', '海滨别墅', 'beachfront-villa', 'Villa with direct beach access', '拥有直接海滩通道的别墅', 2),
('Modern Villa', '现代别墅', 'modern-villa', 'Contemporary design villa with modern features', '具有现代特色的当代设计别墅', 3),
('Eco Villa', '生态别墅', 'eco-villa', 'Environmentally friendly villa with sustainable features', '具有可持续特色的环保别墅', 4),
('Tropical Villa', '热带别墅', 'tropical-villa', 'Villa with tropical garden and natural surroundings', '拥有热带花园和自然环境的别墅', 5),
('Pool Villa', '泳池别墅', 'pool-villa', 'Villa with private swimming pool', '拥有私人游泳池的别墅', 6),
('Garden Villa', '花园别墅', 'garden-villa', 'Villa surrounded by beautiful gardens', '被美丽花园环绕的别墅', 7),
('Cliff Villa', '悬崖别墅', 'cliff-villa', 'Villa located on clifftop with ocean views', '位于悬崖顶部拥有海景的别墅', 8);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_property_types_final_active ON public.property_types_final_2026_02_21_17_30(is_active);
CREATE INDEX IF NOT EXISTS idx_property_types_final_slug ON public.property_types_final_2026_02_21_17_30(slug);

-- 启用RLS
ALTER TABLE public.property_types_final_2026_02_21_17_30 ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "Public read access for active property types" ON public.property_types_final_2026_02_21_17_30
  FOR SELECT USING (is_active = true);

-- 创建更新时间戳触发器
CREATE TRIGGER update_property_types_final_updated_at 
  BEFORE UPDATE ON public.property_types_final_2026_02_21_17_30 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 验证房产类型表
SELECT 
  'Property Types Created' as status,
  COUNT(*) as type_count,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_types
FROM public.property_types_final_2026_02_21_17_30;