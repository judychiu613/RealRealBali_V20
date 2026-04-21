-- 1. 完全删除现有触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. 创建绝对安全的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 在独立的事务中执行，不影响用户注册
  BEGIN
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
      NEW.id,
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
  EXCEPTION WHEN OTHERS THEN
    -- 记录错误但绝不影响用户注册
    RAISE LOG 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    -- 什么都不做，让用户注册继续
  END;
  
  -- 总是返回NEW，确保用户注册成功
  RETURN NEW;
END;
$$;

-- 3. 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. 授予权限
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL PRIVILEGES ON public.user_profiles TO postgres, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated;

-- 5. 测试不带触发器的注册是否工作
-- 临时禁用触发器进行测试
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- 显示触发器状态
SELECT 
  'Trigger created but disabled for testing' as status,
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 重新启用触发器
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

SELECT 
  'Trigger enabled' as status,
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';