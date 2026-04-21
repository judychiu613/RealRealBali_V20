-- 检查区域表的RLS策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'property_areas_final_2026_02_21_17_30';

-- 暂时禁用RLS以测试
ALTER TABLE public.property_areas_final_2026_02_21_17_30 DISABLE ROW LEVEL SECURITY;

-- 或者创建允许所有人读取的策略
DROP POLICY IF EXISTS "Allow public read access" ON public.property_areas_final_2026_02_21_17_30;
CREATE POLICY "Allow public read access" ON public.property_areas_final_2026_02_21_17_30
FOR SELECT USING (true);

-- 重新启用RLS
ALTER TABLE public.property_areas_final_2026_02_21_17_30 ENABLE ROW LEVEL SECURITY;