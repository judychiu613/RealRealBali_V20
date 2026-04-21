-- 1. 检查user_profiles表的RLS状态
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  forcerowsecurity
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

-- 4. 检查唯一约束和索引
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'user_profiles';

-- 5. 检查外键约束
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'user_profiles';

-- 6. 测试匿名用户插入权限（这会失败，但能看到具体错误）
-- 注意：这个测试会失败，但能帮助我们了解权限问题
DO $$
BEGIN
  -- 尝试以匿名用户身份插入（模拟前端行为）
  RAISE NOTICE 'Testing anonymous insert permissions...';
  
  -- 检查当前用户角色
  RAISE NOTICE 'Current user: %', current_user;
  RAISE NOTICE 'Current role: %', current_setting('role');
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in permission test: % %', SQLERRM, SQLSTATE;
END $$;