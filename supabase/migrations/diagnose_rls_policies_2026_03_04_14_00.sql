-- 1. 检查RLS策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 2. 检查表的RLS状态
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  forcerowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 3. 检查当前用户权限
SELECT current_user, session_user;

-- 4. 测试能否直接插入数据到user_profiles表
-- 注意：这只是检查权限，不会实际插入数据
EXPLAIN (FORMAT TEXT) 
INSERT INTO user_profiles (id, email, full_name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User');