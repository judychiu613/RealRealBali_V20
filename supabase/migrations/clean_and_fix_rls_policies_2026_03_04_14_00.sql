-- 1. 检查并删除所有现有策略
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- 获取所有user_profiles表的策略
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- 2. 创建新的宽松INSERT策略（解决注册问题）
CREATE POLICY "Allow registration insert" ON user_profiles
  FOR INSERT 
  WITH CHECK (true);  -- 临时允许所有插入，稍后会限制

-- 3. 创建SELECT策略（用户只能查看自己的记录）
CREATE POLICY "Users view own profile" ON user_profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- 4. 创建UPDATE策略（用户只能更新自己的记录）
CREATE POLICY "Users update own profile" ON user_profiles
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. 创建DELETE策略（用户只能删除自己的记录）
CREATE POLICY "Users delete own profile" ON user_profiles
  FOR DELETE 
  USING (auth.uid() = id);

-- 6. 确保RLS启用
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 7. 验证策略
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;