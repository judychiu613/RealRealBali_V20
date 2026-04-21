-- 全面诊断Supabase项目状态

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

-- 4. 检查是否有孤立的用户（在auth.users但不在user_profiles）
SELECT 
  'orphaned users check' as test,
  COUNT(*) as orphaned_count
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.id
WHERE up.id IS NULL;

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

-- 6. 检查RLS状态
SELECT 
  'RLS status' as test,
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  hasrls as has_rls_policies
FROM pg_tables 
WHERE schemaname IN ('auth', 'public')
  AND tablename IN ('users', 'user_profiles');

-- 7. 检查策略
SELECT 
  'policies check' as test,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression
FROM pg_policies
WHERE schemaname IN ('auth', 'public')
  AND tablename IN ('users', 'user_profiles');

-- 8. 尝试创建测试用户配置文件
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

-- 9. 显示最近的错误日志（如果有）
SELECT 
  'recent activity' as test,
  'Last 5 user_profiles entries' as description,
  id, email, created_at, role
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- 10. 最终状态总结
SELECT 
  'FINAL DIAGNOSIS' as test,
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users) THEN 'auth.users accessible'
    ELSE 'auth.users not accessible'
  END as auth_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.user_profiles) THEN 'user_profiles accessible'
    ELSE 'user_profiles not accessible'
  END as profiles_status,
  'Check above for specific issues' as recommendation;