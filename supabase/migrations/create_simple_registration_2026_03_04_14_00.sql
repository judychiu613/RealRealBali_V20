-- 1. 删除可能有问题的触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. 检查user_profiles表是否可以正常插入
INSERT INTO user_profiles (
  id, 
  email, 
  full_name,
  country_code,
  phone_number,
  preferred_language,
  preferred_currency,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'manual-test@example.com',
  'Manual Test User',
  '+86',
  '13800138000',
  'zh',
  'CNY',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 3. 验证插入成功
SELECT COUNT(*) as manual_insert_count 
FROM user_profiles 
WHERE email = 'manual-test@example.com';

-- 4. 清理测试数据
DELETE FROM user_profiles WHERE email = 'manual-test@example.com';

-- 5. 创建简化的触发器（如果需要）
CREATE OR REPLACE FUNCTION public.simple_handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- 最简单的插入，不做复杂检查
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
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 即使失败也不阻止用户注册
    RETURN NEW;
END;
$$;

-- 6. 创建简化的触发器
CREATE TRIGGER simple_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.simple_handle_new_user();

-- 7. 验证触发器创建
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'simple_on_auth_user_created';