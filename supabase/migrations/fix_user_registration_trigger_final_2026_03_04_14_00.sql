-- 1. 检查当前触发器状态
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. 检查函数是否存在
SELECT 
  routine_name, 
  routine_type,
  routine_schema
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. 删除现有触发器和函数（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. 重新创建修复版本的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 插入用户配置文件记录
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
  RAISE LOG 'Successfully created/updated user profile for user %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 记录详细错误但不阻止用户注册
    RAISE LOG 'Error in handle_new_user for user %: % %', NEW.id, SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 重新创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. 验证触发器创建成功
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';