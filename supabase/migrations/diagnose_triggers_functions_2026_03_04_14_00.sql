-- 1. 检查触发器是否存在
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. 检查函数是否存在
SELECT 
  routine_name, 
  routine_type,
  routine_schema,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. 检查函数的详细定义
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 4. 检查auth.users表是否存在（触发器的目标表）
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'users' AND table_schema = 'auth';