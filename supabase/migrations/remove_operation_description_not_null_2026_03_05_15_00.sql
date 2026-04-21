-- 移除 operation_description 字段的 NOT NULL 约束
ALTER TABLE public.admin_operation_logs 
ALTER COLUMN operation_description DROP NOT NULL;