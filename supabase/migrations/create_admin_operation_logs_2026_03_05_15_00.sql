-- 创建管理员操作日志表
CREATE TABLE IF NOT EXISTS public.admin_operation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 操作人员信息
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email TEXT,
    
    -- 操作对象信息
    target_type TEXT NOT NULL, -- 'property', 'user', 'admin' 等
    target_id TEXT NOT NULL, -- 操作对象的ID
    property_title TEXT, -- 房源标题，便于显示
    
    -- 操作详情
    operation_type TEXT NOT NULL, -- 'approve', 'reject', 'edit', 'delete', 'create' 等
    operation_description TEXT NOT NULL, -- 操作描述
    old_values JSONB, -- 修改前的数据
    new_values JSONB, -- 修改后的数据
    
    -- 状态信息
    status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
    notes TEXT -- 备注信息
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_admin_operation_logs_admin_id ON public.admin_operation_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_operation_logs_target ON public.admin_operation_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_operation_logs_operation_type ON public.admin_operation_logs(operation_type);
CREATE INDEX IF NOT EXISTS idx_admin_operation_logs_created_at ON public.admin_operation_logs(created_at DESC);

-- 启用 RLS
ALTER TABLE public.admin_operation_logs ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：只有管理员可以查看和操作
CREATE POLICY "admin_operation_logs_select_policy" ON public.admin_operation_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_operation_logs_insert_policy" ON public.admin_operation_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 添加注释
COMMENT ON TABLE public.admin_operation_logs IS '管理员操作日志表，记录所有管理员的操作行为';
COMMENT ON COLUMN public.admin_operation_logs.target_type IS '操作对象类型：property, user, admin 等';
COMMENT ON COLUMN public.admin_operation_logs.operation_type IS '操作类型：approve, reject, edit, delete, create 等';
COMMENT ON COLUMN public.admin_operation_logs.old_values IS '修改前的数据（JSON格式）';
COMMENT ON COLUMN public.admin_operation_logs.new_values IS '修改后的数据（JSON格式）';