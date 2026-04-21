-- 1. 检查user_profiles表结构，特别是role字段
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 2. 检查现有user_profiles记录的role值
SELECT 
  role,
  COUNT(*) as count
FROM user_profiles 
GROUP BY role;

-- 3. 尝试插入一个没有role的测试记录（看是否会失败）
DO $$
BEGIN
  INSERT INTO user_profiles (
    id, 
    email, 
    full_name,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    'role-test@example.com',
    'Role Test User',
    NOW(),
    NOW()
  );
  
  RAISE NOTICE 'Insert without role succeeded';
  
  -- 清理测试数据
  DELETE FROM user_profiles WHERE email = 'role-test@example.com';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Insert without role failed: %', SQLERRM;
END $$;