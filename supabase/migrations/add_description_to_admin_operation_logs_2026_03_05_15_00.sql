-- 为 admin_operation_logs 表添加 description 字段
ALTER TABLE public.admin_operation_logs 
ADD COLUMN IF NOT EXISTS description TEXT;

-- 添加注释
COMMENT ON COLUMN public.admin_operation_logs.description IS '操作描述';