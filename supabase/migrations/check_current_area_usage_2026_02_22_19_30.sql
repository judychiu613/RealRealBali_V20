-- 查看当前房源使用的所有区域ID
SELECT DISTINCT area_id FROM public.properties ORDER BY area_id;

-- 查看当前property_areas_map中的所有区域
SELECT id, name_zh, name_en FROM public.property_areas_map ORDER BY id;

-- 添加parent_id字段（如果不存在）
ALTER TABLE public.property_areas_map 
ADD COLUMN IF NOT EXISTS parent_id TEXT;