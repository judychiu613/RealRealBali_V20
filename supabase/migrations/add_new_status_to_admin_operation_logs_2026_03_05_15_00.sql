-- 为 admin_operation_logs 表添加 new_status 字段
ALTER TABLE public.admin_operation_logs 
ADD COLUMN IF NOT EXISTS new_status TEXT;

-- 添加注释
COMMENT ON COLUMN public.admin_operation_logs.new_status IS '操作后的状态值';