-- 创建土地形式表
CREATE TABLE IF NOT EXISTS public.property_land_zones_final_2026_02_22_10_00 (
    id text PRIMARY KEY,
    name_en text NOT NULL,
    name_zh text NOT NULL,
    description_en text,
    description_zh text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 插入巴厘岛土地形式数据
INSERT INTO public.property_land_zones_final_2026_02_22_10_00 (id, name_en, name_zh, description_en, description_zh, sort_order) VALUES
('green_zone', 'Green Zone', '绿色区域', 'Agricultural and natural conservation area', '农业和自然保护区', 1),
('yellow_zone', 'Yellow Zone', '黄色区域', 'Tourism and commercial development area', '旅游和商业开发区', 2),
('red_zone', 'Red Zone', '红色区域', 'Residential and mixed-use area', '住宅和混合用途区', 3),
('blue_zone', 'Blue Zone', '蓝色区域', 'Coastal and marine area', '海岸和海洋区域', 4),
('white_zone', 'White Zone', '白色区域', 'Special economic zone', '特殊经济区', 5)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_zh = EXCLUDED.name_zh,
    description_en = EXCLUDED.description_en,
    description_zh = EXCLUDED.description_zh,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

-- 为现有房源分配土地形式
UPDATE public.properties_final_2026_02_21_17_30 
SET land_zone_id = CASE 
    WHEN id IN ('prop-001', 'prop-003', 'prop-006') THEN 'blue_zone'  -- 海滨房产
    WHEN id IN ('prop-002', 'prop-004', 'prop-005') THEN 'yellow_zone' -- 旅游区房产
    WHEN id IN ('prop-007', 'prop-009', 'prop-010') THEN 'green_zone'  -- 自然区房产
    WHEN id = 'prop-008' THEN 'red_zone'  -- 住宅区房产
    ELSE 'yellow_zone'  -- 默认旅游区
END;

-- 验证更新结果
SELECT 
    p.id,
    p.title_zh,
    p.land_zone_id,
    lz.name_zh as land_zone_name
FROM public.properties_final_2026_02_21_17_30 p
LEFT JOIN public.property_land_zones_final_2026_02_22_10_00 lz ON p.land_zone_id = lz.id
WHERE p.id IN ('prop-001', 'prop-002', 'prop-003', 'prop-004', 'prop-005')
ORDER BY p.id;