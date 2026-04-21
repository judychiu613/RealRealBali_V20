-- 为房产表添加建造年份字段
ALTER TABLE public.properties_final_2026_02_21_17_30 
ADD COLUMN build_year INTEGER;

-- 添加注释
COMMENT ON COLUMN public.properties_final_2026_02_21_17_30.build_year IS '建造年份';

-- 为现有房产添加建造年份数据
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2020 WHERE id = 'prop-001';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2019 WHERE id = 'prop-002';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2021 WHERE id = 'prop-003';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2022 WHERE id = 'prop-004';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2018 WHERE id = 'prop-005';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2023 WHERE id = 'prop-006';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2017 WHERE id = 'prop-007';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2024 WHERE id = 'prop-008';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2019 WHERE id = 'prop-009';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2020 WHERE id = 'prop-010';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2021 WHERE id = 'prop-011';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2018 WHERE id = 'prop-012';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2022 WHERE id = 'prop-013';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2023 WHERE id = 'prop-014';
UPDATE public.properties_final_2026_02_21_17_30 SET build_year = 2020 WHERE id = 'prop-015';

-- 验证数据
SELECT id, title_zh, build_year 
FROM public.properties_final_2026_02_21_17_30 
WHERE is_published = true 
ORDER BY id;