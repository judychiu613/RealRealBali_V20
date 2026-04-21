-- 启用RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 删除所有现有策略
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow trigger inserts" ON public.user_profiles;

-- 创建标准RLS策略
CREATE POLICY "user_profiles_insert_policy" ON public.user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_select_policy" ON public.user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "user_profiles_update_policy" ON public.user_profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- 确认策略创建
SELECT 
  'RLS policies created' as status,
  policyname,
  cmd as command
FROM pg_policies 
WHERE tablename = 'user_profiles';