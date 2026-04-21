-- 修复版全面诊断

-- 1. 检查基本连接
SELECT 'Database connection test' as test, NOW() as current_time;

-- 2. 检查auth.users表
SELECT 
  'auth.users status' as test,
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 END) as recent_users
FROM auth.users;

-- 3. 检查user_profiles表
SELECT 
  'user_profiles status' as test,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 day' THEN 1 END) as recent_profiles
FROM public.user_profiles;

-- 4. 检查RLS状态（修复版）
SELECT 
  'RLS status' as test,
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname IN ('auth', 'public')
  AND tablename IN ('users', 'user_profiles');

-- 5. 检查所有触发器状态
SELECT 
  'trigger status' as test,
  n.nspname as schema_name,
  c.relname as table_name,
  t.tgname as trigger_name,
  CASE t.tgenabled 
    WHEN 'O' THEN 'enabled'
    WHEN 'D' THEN 'disabled'
    WHEN 'R' THEN 'replica'
    WHEN 'A' THEN 'always'
    ELSE 'unknown'
  END as status
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname IN ('auth', 'public')
  AND c.relname IN ('users', 'user_profiles')
ORDER BY n.nspname, c.relname, t.tgname;

-- 6. 尝试创建测试用户配置文件
DO $$
DECLARE
    test_id uuid := gen_random_uuid();
    test_email text := 'sql-test-' || extract(epoch from now()) || '@example.com';
BEGIN
    -- 测试插入user_profiles
    INSERT INTO public.user_profiles (
        id, email, role, is_active, created_at, updated_at,
        preferred_language, preferred_currency
    ) VALUES (
        test_id, test_email, 'user', true, NOW(), NOW(),
        'zh', 'CNY'
    );
    
    -- 立即删除测试数据
    DELETE FROM public.user_profiles WHERE id = test_id;
    
    RAISE NOTICE 'SQL TEST SUCCESS: Can insert/delete user_profiles';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'SQL TEST FAILED: Cannot insert user_profiles - %', SQLERRM;
END $$;

-- 7. 显示最近的活动
SELECT 
  'recent activity' as test,
  'Last 3 user_profiles entries' as description,
  id, email, created_at, role
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 3;

-- 8. 检查是否有孤立用户
SELECT 
  'orphaned users' as test,
  COUNT(*) as count,
  'Users in auth.users but not in user_profiles' as description
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL;

-- 9. 最终诊断
SELECT 
  'FINAL DIAGNOSIS' as test,
  'Database accessible, check Supabase Auth service status' as recommendation,
  'Problem likely in Supabase Auth API, not database' as conclusion;