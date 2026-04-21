-- 1. 重新启用RLS（之前为了调试临时禁用了）
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. 创建正确的RLS策略
-- 删除所有现有策略
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- 创建新的策略
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = id);

-- 注意：不创建INSERT策略，因为触发器使用SECURITY DEFINER权限

-- 3. 删除现有触发器
DROP TRIGGER IF EXISTS simple_on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.simple_handle_new_user();

-- 4. 创建正确的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER  -- 关键：使用定义者权限绕过RLS
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  -- 记录触发器执行
  RAISE LOG 'handle_new_user triggered for user: %, email: %', NEW.id, NEW.email;
  
  -- 使用NEW.id（来自auth.users的真实ID）插入user_profiles
  -- 这样外键约束就能满足了
  INSERT INTO public.user_profiles (
    id,  -- 使用auth.users.id，满足外键约束
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
    NEW.id,  -- 关键：使用真实的用户ID
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
    updated_at = NOW();
  
  RAISE LOG 'Successfully created user profile for user: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'ERROR in handle_new_user for user %: %', NEW.id, SQLERRM;
    -- 不阻止用户注册
    RETURN NEW;
END;
$$;

-- 5. 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. 验证设置
SELECT 
  'RLS Status' as check_type,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_tables 
WHERE tablename = 'user_profiles'
UNION ALL
SELECT 
  'Trigger Status' as check_type,
  CASE WHEN COUNT(*) > 0 THEN 'EXISTS' ELSE 'MISSING' END as status
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';