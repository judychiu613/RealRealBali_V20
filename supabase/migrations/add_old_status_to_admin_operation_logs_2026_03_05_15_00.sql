-- 为 admin_operation_logs 表添加 old_status 字段
ALTER TABLE public.admin_operation_logs 
ADD COLUMN IF NOT EXISTS old_status TEXT;

-- 添加注释
COMMENT ON COLUMN public.admin_operation_logs.old_status IS '操作前的状态值';