-- 1. 删除现有触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. 重新创建触发器函数（修复外键问题）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  -- 记录开始日志
  RAISE LOG 'handle_new_user triggered for user: %', NEW.id;
  RAISE LOG 'User email: %', NEW.email;
  RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
  
  -- 确保auth.users记录已经存在（应该存在，因为这是AFTER INSERT触发器）
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = NEW.id) THEN
    RAISE LOG 'ERROR: auth.users record not found for user %', NEW.id;
    RETURN NEW;
  END IF;
  
  -- 插入用户配置文件（现在外键约束应该满足）
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
    NEW.id,  -- 这个ID现在在auth.users中存在
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
  WHEN foreign_key_violation THEN
    RAISE LOG 'FOREIGN KEY ERROR in handle_new_user for user %: %', NEW.id, SQLERRM;
    RAISE LOG 'This means auth.users record does not exist for user %', NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE LOG 'ERROR in handle_new_user for user %: SQLSTATE=%, SQLERRM=%', NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. 重新创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. 验证触发器创建
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';