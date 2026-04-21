-- 暂时禁用触发器，避免注册时的数据库错误
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 删除可能有问题的函数
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 确保user_profiles表存在但不依赖触发器
-- 用户注册后可以手动创建配置文件