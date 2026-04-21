-- 1. 删除现有触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. 创建修复的触发器函数（包含role字段）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  -- 记录触发器执行
  RAISE LOG 'handle_new_user triggered for user: %, email: %', NEW.id, NEW.email;
  
  -- 插入用户配置文件，包含默认role
  INSERT INTO public.user_profiles (
    id,
    email, 
    full_name,
    country_code,
    phone_number,
    preferred_language,
    preferred_currency,
    role,  -- 添加role字段
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
    'user',  -- 默认角色为'user'
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), user_profiles.full_name),
    role = COALESCE(EXCLUDED.role, user_profiles.role, 'user'),  -- 确保role有值
    updated_at = NOW();
  
  RAISE LOG 'Successfully created user profile for user: % with role: user', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'ERROR in handle_new_user for user %: %', NEW.id, SQLERRM;
    -- 不阻止用户注册
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

-- 5. 如果role字段没有默认值，为表添加默认值
ALTER TABLE user_profiles 
ALTER COLUMN role SET DEFAULT 'user';

-- 6. 验证默认值设置
SELECT 
  column_name,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name = 'role';