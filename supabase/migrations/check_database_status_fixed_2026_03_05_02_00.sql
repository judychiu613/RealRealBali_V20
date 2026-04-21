-- 检查当前表结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查是否有现有的触发器
SELECT 
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname LIKE '%user%';

-- 检查是否有现有的函数
SELECT 
  proname as function_name,
  prosecdef as security_definer
FROM pg_proc 
WHERE proname LIKE '%user%';

-- 检查表是否存在
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'user_profiles';

-- 测试插入权限（使用最小数据）
DO $$
DECLARE
    test_id uuid := gen_random_uuid();
BEGIN
    -- 尝试插入测试数据
    INSERT INTO public.user_profiles (id, email, role) 
    VALUES (test_id, 'test@example.com', 'user');
    
    -- 如果成功，删除测试数据
    DELETE FROM public.user_profiles WHERE id = test_id;
    
    RAISE NOTICE 'Insert test: SUCCESS - Table accepts basic inserts';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Insert test: FAILED - %', SQLERRM;
END $$;