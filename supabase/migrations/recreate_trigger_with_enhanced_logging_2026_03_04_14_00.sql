-- 1. 删除现有触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. 创建新的触发器函数（增强版本）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER  -- 关键：使用定义者权限
SET search_path = public, auth  -- 设置正确的搜索路径
LANGUAGE plpgsql
AS $$
BEGIN
  -- 记录开始日志
  RAISE LOG 'handle_new_user triggered for user: %', NEW.id;
  RAISE LOG 'User email: %', NEW.email;
  RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
  
  -- 插入用户配置文件
  INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name,
    country_code,
    phone_number,
    preferred_language,
    preferred_currency,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'country_code', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'zh'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'CNY'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), user_profiles.full_name),
    country_code = COALESCE(NULLIF(EXCLUDED.country_code, ''), user_profiles.country_code),
    phone_number = COALESCE(NULLIF(EXCLUDED.phone_number, ''), user_profiles.phone_number),
    preferred_language = COALESCE(NULLIF(EXCLUDED.preferred_language, ''), user_profiles.preferred_language),
    preferred_currency = COALESCE(NULLIF(EXCLUDED.preferred_currency, ''), user_profiles.preferred_currency),
    updated_at = NOW();
  
  -- 记录成功日志
  RAISE LOG 'Successfully created/updated user profile for user: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 详细的错误日志
    RAISE LOG 'ERROR in handle_new_user for user %: SQLSTATE=%, SQLERRM=%', NEW.id, SQLSTATE, SQLERRM;
    RAISE LOG 'Error context: email=%, metadata=%', NEW.email, NEW.raw_user_meta_data;
    
    -- 不阻止用户注册，但记录错误
    RETURN NEW;
END;
$$;

-- 3. 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. 验证触发器创建
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 5. 验证函数创建
SELECT 
  routine_name, 
  routine_type,
  security_type,
  routine_schema
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 6. 测试触发器函数权限
SELECT has_function_privilege('public.handle_new_user()', 'EXECUTE') as can_execute;