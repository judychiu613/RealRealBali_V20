-- 1. 检查user_profiles表的RLS状态
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 2. 检查现有的RLS策略
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 3. 检查表结构和约束
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 4. 检查触发器状态
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 5. 检查函数状态
SELECT 
  routine_name, 
  routine_type,
  routine_schema,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 6. 如果RLS策略不存在或不正确，创建正确的策略
-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- 启用RLS（如果未启用）
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 创建允许用户插入自己配置文件的策略
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 创建允许用户查看自己配置文件的策略
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- 创建允许用户更新自己配置文件的策略
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 验证策略创建成功
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';