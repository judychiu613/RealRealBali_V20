-- 删除并重新创建触发器函数，包含所有必填字段
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 创建完整的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 插入用户配置文件，包含所有可能的必填字段
  INSERT INTO public.user_profiles (
    id,                    -- 主键，来自auth.users.id
    email,                 -- 邮箱，来自auth.users.email
    full_name,             -- 全名，来自metadata或默认空字符串
    avatar_url,            -- 头像URL，默认null
    role,                  -- 角色，默认'user'
    is_active,             -- 是否激活，默认true
    created_at,            -- 创建时间
    updated_at,            -- 更新时间
    preferred_language,    -- 首选语言，来自metadata或默认'zh'
    preferred_currency,    -- 首选货币，来自metadata或默认'CNY'
    country_code,          -- 国家代码，来自metadata或默认null
    phone_number           -- 电话号码，来自metadata或默认null
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NULL,  -- avatar_url默认为null
    'user',  -- role默认为'user'
    true,  -- is_active默认为true
    NOW(),
    NOW(),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'zh'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_currency', 'CNY'),
    NEW.raw_user_meta_data->>'country_code',  -- 可以为null
    NEW.raw_user_meta_data->>'phone_number'   -- 可以为null
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- 记录错误但不阻止用户创建
  RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 授予权限
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON public.user_profiles TO postgres;

-- 验证触发器创建
SELECT 'Trigger and function recreated with all required fields' as status;

-- 显示当前配置文件数量
SELECT COUNT(*) as current_profiles FROM public.user_profiles;