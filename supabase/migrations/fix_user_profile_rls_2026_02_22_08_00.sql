-- 确保用户可以更新自己的资料
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles_2026_02_21_06_55;

CREATE POLICY "Users can update own profile" 
ON public.user_profiles_2026_02_21_06_55 
FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 确保用户可以查看自己的资料
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles_2026_02_21_06_55;

CREATE POLICY "Users can view own profile" 
ON public.user_profiles_2026_02_21_06_55 
FOR SELECT 
USING (auth.uid() = id);

-- 确保用户可以插入自己的资料
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles_2026_02_21_06_55;

CREATE POLICY "Users can insert own profile" 
ON public.user_profiles_2026_02_21_06_55 
FOR INSERT 
WITH CHECK (auth.uid() = id);