-- 完全禁用RLS
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 删除所有RLS策略
DROP POLICY IF EXISTS "user_profiles_insert_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_policy" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_policy" ON public.user_profiles;

-- 测试无RLS插入
DO $$
BEGIN
    INSERT INTO public.user_profiles (id, email) 
    VALUES (gen_random_uuid(), 'no-rls-test@example.com');
    RAISE NOTICE 'SUCCESS: No RLS insert worked';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'NO RLS INSERT ERROR: %', SQLERRM;
END $$;

-- 显示当前表状态
SELECT 'Table status check' as info;
SELECT tablename, rowsecurity as rls_enabled FROM pg_tables WHERE tablename = 'user_profiles';