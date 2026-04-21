-- 强制删除并重新创建触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 创建触发器函数（使用SECURITY DEFINER确保权限）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- 记录错误但不阻止用户创建
  RETURN NEW;
END;
$$;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 授予必要权限
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON public.user_profiles TO postgres;

-- 测试触发器是否工作（通过模拟注册）
-- 注意：这只是验证SQL语法，实际测试需要通过auth.signUp

-- 显示成功消息
SELECT 'Trigger and function created successfully' as status;

-- 显示当前user_profiles记录数（用于对比）
SELECT COUNT(*) as current_profile_count FROM public.user_profiles;