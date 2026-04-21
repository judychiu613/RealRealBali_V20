-- 1. 检查是否可以手动调用触发器函数
-- 创建一个测试记录来模拟NEW记录
DO $$
DECLARE
  test_record RECORD;
BEGIN
  -- 模拟一个auth.users记录
  SELECT 
    '12345678-1234-1234-1234-123456789012'::uuid as id,
    'test@example.com' as email,
    '{"full_name": "Test User", "country_code": "+86", "phone_number": "13800138000", "preferred_language": "zh", "preferred_currency": "CNY"}'::jsonb as raw_user_meta_data
  INTO test_record;
  
  RAISE NOTICE 'Test record created: %', test_record;
  
  -- 检查函数是否存在
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
    RAISE NOTICE 'Function handle_new_user exists';
  ELSE
    RAISE NOTICE 'Function handle_new_user does NOT exist';
  END IF;
  
END $$;

-- 2. 检查user_profiles表中是否有任何数据
SELECT COUNT(*) as total_profiles FROM user_profiles;

-- 3. 检查最近的user_profiles记录
SELECT id, email, full_name, created_at 
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 5;