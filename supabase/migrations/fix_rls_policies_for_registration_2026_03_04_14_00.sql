-- 1. 检查当前RLS策略
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 2. 删除可能有问题的现有策略
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON user_profiles;

-- 3. 创建新的RLS策略，允许注册时插入

-- 策略1: 允许插入 - 在注册过程中允许创建配置文件
-- 这个策略允许在注册时插入，无论是通过触发器还是直接插入
CREATE POLICY "Allow profile creation during registration" ON user_profiles
  FOR INSERT 
  WITH CHECK (
    -- 允许以下情况插入：
    -- 1. 用户ID匹配当前认证用户（正常情况）
    -- 2. 或者当前用户角色是authenticated（注册过程中）
    -- 3. 或者通过触发器插入（使用SECURITY DEFINER权限）
    auth.uid() = id 
    OR 
    auth.role() = 'authenticated'
    OR
    current_setting('role') = 'postgres'
  );

-- 策略2: 允许查看自己的配置文件
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT 
  USING (
    auth.uid() = id
  );

-- 策略3: 允许更新自己的配置文件
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. 确保RLS已启用
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. 验证策略创建成功
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;