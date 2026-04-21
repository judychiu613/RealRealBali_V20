-- 删除可能存在的旧触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 创建用户配置文件触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  -- 记录触发器执行日志
  RAISE LOG 'handle_new_user triggered for user: %, email: %', NEW.id, NEW.email;
  RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
  
  -- 插入用户配置文件，包含所有必填字段
  INSERT INTO public.user_profiles (
    id,                    -- 来自NEW.id (auth.users.id)
    email,                 -- 来自NEW.email
    full_name,             -- 来自metadata.full_name
    country_code,          -- 来自metadata.country_code
    phone_number,          -- 来自metadata.phone_number
    preferred_language,    -- 来自metadata.preferred_language
    preferred_currency,    -- 来自metadata.preferred_currency
    role,                  -- 默认设置为'user' (必填字段)
    created_at,            -- 当前时间
    updated_at             -- 当前时间
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'country_code', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'zh'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'CNY'),
    'user',                -- 明确设置role为'user' (解决必填字段问题)
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
    role = COALESCE(EXCLUDED.role, user_profiles.role, 'user'),
    updated_at = NOW();
  
  RAISE LOG 'Successfully created user profile for user: % with role: user', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 记录详细错误信息
    RAISE LOG 'ERROR in handle_new_user for user %: SQLSTATE=%, SQLERRM=%', NEW.id, SQLSTATE, SQLERRM;
    -- 不阻止用户注册，但记录错误
    RETURN NEW;
END;
$$;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 验证触发器创建成功
SELECT 
  'Trigger created successfully' as status,
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 验证函数创建成功
SELECT 
  'Function created successfully' as status,
  proname as function_name,
  prosecdef as security_definer
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 显示当前user_profiles表结构（用于验证）
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;