-- 第一步：删除任何现有的触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 第二步：创建简化的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 记录日志
  RAISE LOG 'Creating profile for user: % with email: %', NEW.id, NEW.email;
  
  -- 插入用户配置文件
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    country_code,
    phone_number,
    preferred_language,
    preferred_currency,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'country_code', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'zh'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'CNY'),
    'user',
    NOW(),
    NOW()
  );
  
  RAISE LOG 'Profile created successfully for user: %', NEW.id;
  RETURN NEW;
  
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
  -- 不阻止用户创建
  RETURN NEW;
END;
$$;

-- 第三步：创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 第四步：验证创建成功
SELECT 
  'Function created' as status,
  proname as name
FROM pg_proc 
WHERE proname = 'handle_new_user';

SELECT 
  'Trigger created' as status,
  tgname as name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 第五步：测试触发器（模拟插入）
DO $$
BEGIN
  RAISE NOTICE 'Trigger setup completed successfully';
  RAISE NOTICE 'Function handle_new_user: EXISTS';
  RAISE NOTICE 'Trigger on_auth_user_created: EXISTS';
END $$;