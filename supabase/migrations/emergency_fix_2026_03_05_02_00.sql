-- 紧急修复步骤1：完全禁用user_profiles的RLS
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 紧急修复步骤2：删除所有可能阻止插入的策略
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow trigger inserts" ON public.user_profiles;

-- 紧急修复步骤3：删除所有触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 紧急修复步骤4：测试基本插入是否工作
DO $$
DECLARE
    test_id uuid := gen_random_uuid();
BEGIN
    INSERT INTO public.user_profiles (
        id, email, role, is_active, created_at, updated_at,
        preferred_language, preferred_currency
    ) VALUES (
        test_id, 'emergency-test@example.com', 'user', true, NOW(), NOW(),
        'zh', 'CNY'
    );
    
    DELETE FROM public.user_profiles WHERE id = test_id;
    
    RAISE NOTICE 'EMERGENCY TEST: SUCCESS - Basic insert works';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EMERGENCY TEST: FAILED - %', SQLERRM;
END $$;

-- 显示当前状态
SELECT 'RLS disabled, policies dropped, triggers removed' as emergency_fix_status;
SELECT COUNT(*) as current_profiles FROM public.user_profiles;