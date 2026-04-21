-- 检查auth.users表状态
SELECT 
  'auth.users table check' as test,
  COUNT(*) as user_count
FROM auth.users;

-- 检查是否有阻止auth.users插入的触发器
SELECT 
  'auth.users triggers' as test,
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' AND c.relname = 'users';

-- 检查auth schema权限
SELECT 
  'auth schema permissions' as test,
  nspname as schema_name,
  nspowner
FROM pg_namespace 
WHERE nspname = 'auth';

-- 测试能否直接插入auth.users（这通常会失败，但能看到具体错误）
DO $$
BEGIN
    -- 这个测试预期会失败，但能显示具体错误
    INSERT INTO auth.users (
        id, 
        email, 
        encrypted_password,
        created_at,
        updated_at,
        email_confirmed_at,
        confirmation_token
    ) VALUES (
        gen_random_uuid(),
        'direct-test@example.com',
        'dummy',
        NOW(),
        NOW(),
        NOW(),
        'dummy'
    );
    RAISE NOTICE 'UNEXPECTED: Direct auth.users insert succeeded';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXPECTED: Direct auth.users insert failed - %', SQLERRM;
END $$;

-- 检查是否有其他阻止性触发器
SELECT 
  'All triggers on auth tables' as test,
  n.nspname as schema_name,
  c.relname as table_name,
  t.tgname as trigger_name,
  t.tgenabled as enabled
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth'
ORDER BY c.relname, t.tgname;