-- 删除所有触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 确认删除
SELECT 'All triggers and functions removed' as status;