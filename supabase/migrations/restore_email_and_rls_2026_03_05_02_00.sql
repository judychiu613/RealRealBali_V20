-- 恢复email字段为NOT NULL
ALTER TABLE public.user_profiles 
ALTER COLUMN email SET NOT NULL;

-- 重新启用RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 重新创建标准RLS策略
CREATE POLICY "user_profiles_insert_policy" ON public.user_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_select_policy" ON public.user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "user_profiles_update_policy" ON public.user_profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- 确认恢复状态
SELECT 'Settings restored' as status;
SELECT tablename, rowsecurity as rls_enabled FROM pg_tables WHERE tablename = 'user_profiles';