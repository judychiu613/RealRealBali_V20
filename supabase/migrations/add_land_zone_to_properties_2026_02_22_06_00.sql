-- 为房产表添加土地形式字段
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD COLUMN IF NOT EXISTS land_zone_id VARCHAR(20);

-- 添加外键约束
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD CONSTRAINT fk_properties_land_zone 
FOREIGN KEY (land_zone_id) REFERENCES public.land_zones_2026_02_22_06_00(id);

-- 为现有房产随机分配土地形式（用于演示）
UPDATE public.properties_final_2026_02_21_17_30 
SET land_zone_id = CASE 
  WHEN id IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005') THEN 'pinkzone'
  WHEN id IN ('prop-006', 'prop-007', 'prop-008', 'prop-009', 'prop-010') THEN 'yellowzone'
  WHEN id IN ('prop-011', 'prop-012', 'prop-013', 'prop-014', 'prop-015') THEN 'greenzone'
  ELSE 'pinkzone'
END
WHERE land_zone_id IS NULL;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_properties_land_zone_id ON public.properties_final_2026_02_21_17_30(land_zone_id);