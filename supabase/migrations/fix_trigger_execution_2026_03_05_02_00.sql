-- 1. 删除现有触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. 创建带调试日志的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER  -- 关键：使用函数定义者权限
SET search_path = public  -- 关键：明确设置search_path
AS $$
BEGIN
  -- 调试日志：记录触发器开始执行
  RAISE LOG 'TRIGGER START: User ID = %, Email = %', NEW.id, NEW.email;
  RAISE LOG 'TRIGGER METADATA: %', NEW.raw_user_meta_data;
  
  -- 调试日志：记录即将插入的数据
  RAISE LOG 'TRIGGER INSERT: About to insert profile for user %', NEW.id;
  
  -- 执行插入操作
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    is_active,
    created_at,
    updated_at,
    preferred_language,
    preferred_currency,
    country_code,
    phone_number
  ) VALUES (
    NEW.id,  -- 关键：直接使用NEW.id，不是auth.uid()
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NULL,
    'user',
    true,
    NOW(),
    NOW(),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'zh'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'CNY'),
    NEW.raw_user_meta_data->>'country_code',
    NEW.raw_user_meta_data->>'phone_number'
  );
  
  -- 调试日志：记录插入成功
  RAISE LOG 'TRIGGER SUCCESS: Profile created for user %', NEW.id;
  
  RETURN NEW;
  
EXCEPTION WHEN OTHERS THEN
  -- 调试日志：记录详细错误
  RAISE LOG 'TRIGGER ERROR: User %, SQLSTATE %, SQLERRM %', NEW.id, SQLSTATE, SQLERRM;
  RAISE LOG 'TRIGGER ERROR DETAIL: %', SQLSTATE;
  RAISE LOG 'TRIGGER ERROR HINT: %', SQLERRM;
  
  -- 重要：不阻止用户注册，但记录错误
  RETURN NEW;
END;
$$;

-- 3. 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. 授予必要权限
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON public.user_profiles TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

-- 5. 验证触发器创建
SELECT 
  'Trigger created successfully' as status,
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

SELECT 
  'Function created successfully' as status,
  proname as function_name,
  prosecdef as security_definer
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 6. 测试触发器权限（模拟插入）
DO $$
DECLARE
    test_user_id uuid := gen_random_uuid();
    test_email text := 'trigger-test@example.com';
BEGIN
    -- 测试直接插入user_profiles（模拟触发器行为）
    INSERT INTO public.user_profiles (
        id, email, role, is_active, created_at, updated_at,
        preferred_language, preferred_currency
    ) VALUES (
        test_user_id, test_email, 'user', true, NOW(), NOW(),
        'zh', 'CNY'
    );
    
    -- 清理测试数据
    DELETE FROM public.user_profiles WHERE id = test_user_id;
    
    RAISE NOTICE 'TRIGGER PERMISSION TEST: SUCCESS - Can insert into user_profiles';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'TRIGGER PERMISSION TEST: FAILED - %', SQLERRM;
END $$;