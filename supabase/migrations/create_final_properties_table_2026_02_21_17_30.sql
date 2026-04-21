-- 重新设计房产主表，支持多货币和英文标签

-- 创建最终版本的房产表
CREATE TABLE IF NOT EXISTS public.properties_final_2026_02_21_17_30 (
  id VARCHAR(20) PRIMARY KEY, -- 房源编号：prop-001, prop-002 等
  title_en VARCHAR(200) NOT NULL,
  title_zh VARCHAR(200) NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  
  -- 多货币价格支持
  price_usd INTEGER NOT NULL, -- 美元价格
  price_cny INTEGER, -- 人民币价格
  price_idr BIGINT, -- 印尼盾价格
  
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  building_area INTEGER NOT NULL, -- 建筑面积（平方米）
  land_area INTEGER NOT NULL, -- 土地面积（平方米）
  
  -- 使用新的区域ID格式
  area_id VARCHAR(50) REFERENCES public.property_areas_final_2026_02_21_17_30(id),
  type_id UUID REFERENCES public.property_types_optimized_2026_02_21_17_00(id),
  
  status property_status DEFAULT 'available',
  ownership property_ownership DEFAULT 'leasehold',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- 双语标签支持
  tags_en TEXT[], -- 英文标签
  tags_zh TEXT[], -- 中文标签
  
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_properties_final_area ON public.properties_final_2026_02_21_17_30(area_id);
CREATE INDEX IF NOT EXISTS idx_properties_final_type ON public.properties_final_2026_02_21_17_30(type_id);
CREATE INDEX IF NOT EXISTS idx_properties_final_featured ON public.properties_final_2026_02_21_17_30(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_final_published ON public.properties_final_2026_02_21_17_30(is_published);
CREATE INDEX IF NOT EXISTS idx_properties_final_price_usd ON public.properties_final_2026_02_21_17_30(price_usd);
CREATE INDEX IF NOT EXISTS idx_properties_final_bedrooms ON public.properties_final_2026_02_21_17_30(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_final_land_area ON public.properties_final_2026_02_21_17_30(land_area);

-- 启用RLS
ALTER TABLE public.properties_final_2026_02_21_17_30 ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "Public read access for published properties" ON public.properties_final_2026_02_21_17_30
  FOR SELECT USING (is_published = true);

-- 创建更新时间戳触发器
CREATE TRIGGER update_properties_final_updated_at 
  BEFORE UPDATE ON public.properties_final_2026_02_21_17_30 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 验证表结构
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30' 
  AND table_schema = 'public'
ORDER BY ordinal_position;