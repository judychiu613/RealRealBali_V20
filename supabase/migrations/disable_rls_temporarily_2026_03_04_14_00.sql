-- 1. 完全禁用RLS（临时解决方案，确保触发器能工作）
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. 验证RLS状态
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 3. 清理所有现有策略
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- 4. 验证策略已清理
SELECT COUNT(*) as remaining_policies
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 注意：这是临时方案，注册功能正常后我们会重新启用RLS并创建正确的策略