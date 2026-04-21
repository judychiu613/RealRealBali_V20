-- 创建土地形式表
CREATE TABLE IF NOT EXISTS public.land_zones_2026_02_22_06_00 (
  id VARCHAR(20) PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入土地形式数据
INSERT INTO public.land_zones_2026_02_22_06_00 (id, name_en, name_zh, description_en, description_zh) VALUES
('pinkzone', 'Pink Zone', '旅游用地', 'Tourism and hospitality development zone', '专门用于旅游和酒店业发展的区域'),
('yellowzone', 'Yellow Zone', '住宅用地', 'Residential development zone', '专门用于住宅开发的区域'),
('greenzone', 'Green Zone', '农业用地', 'Agricultural and farming zone', '专门用于农业和种植的区域'),
('bluezone', 'Blue Zone', '商业用地', 'Commercial development zone', '专门用于商业开发的区域'),
('whitezone', 'White Zone', '混合用地', 'Mixed-use development zone', '可用于多种用途的混合开发区域');

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_land_zones_id ON public.land_zones_2026_02_22_06_00(id);

-- 设置RLS策略
ALTER TABLE public.land_zones_2026_02_22_06_00 ENABLE ROW LEVEL SECURITY;

-- 允许所有用户读取土地形式数据
CREATE POLICY "Allow public read access to land zones" ON public.land_zones_2026_02_22_06_00
FOR SELECT USING (true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_land_zones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_land_zones_updated_at_trigger
  BEFORE UPDATE ON public.land_zones_2026_02_22_06_00
  FOR EACH ROW
  EXECUTE FUNCTION update_land_zones_updated_at();