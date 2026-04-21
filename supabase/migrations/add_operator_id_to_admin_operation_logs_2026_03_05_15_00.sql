-- 为 admin_operation_logs 表添加 operator_id 字段
ALTER TABLE public.admin_operation_logs 
ADD COLUMN IF NOT EXISTS operator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 创建 operator_id 索引
CREATE INDEX IF NOT EXISTS idx_admin_operation_logs_operator_id ON public.admin_operation_logs(operator_id);

-- 添加注释
COMMENT ON COLUMN public.admin_operation_logs.operator_id IS '操作员ID，关联到auth.users表';