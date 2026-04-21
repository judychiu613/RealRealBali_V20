-- =============================
-- 房源审批系统数据库扩展
-- =============================

-- 1. 为properties表添加审批相关字段
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_properties_approval_status ON properties(approval_status);
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON properties(created_by);
CREATE INDEX IF NOT EXISTS idx_properties_approved_by ON properties(approved_by);

-- 3. 更新现有房源的审批状态（设为已通过，因为它们已经在线上）
UPDATE properties 
SET approval_status = 'approved', 
    approved_at = created_at 
WHERE approval_status = 'pending';

-- 4. 创建房源审批日志表
CREATE TABLE IF NOT EXISTS property_approval_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('submit', 'approve', 'reject', 'resubmit')),
    performed_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建索引
CREATE INDEX IF NOT EXISTS idx_approval_logs_property_id ON property_approval_logs(property_id);
CREATE INDEX IF NOT EXISTS idx_approval_logs_performed_by ON property_approval_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_approval_logs_created_at ON property_approval_logs(created_at DESC);

-- 6. 设置RLS策略
ALTER TABLE property_approval_logs ENABLE ROW LEVEL SECURITY;

-- 管理员可以查看所有审批日志
CREATE POLICY "approval_logs_admin_read" ON property_approval_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 管理员可以创建审批日志
CREATE POLICY "approval_logs_admin_insert" ON property_approval_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 7. 更新properties表的RLS策略，添加审批相关逻辑
DROP POLICY IF EXISTS "properties_read_all" ON properties;

-- 公开读取已通过审核且已发布的房源
CREATE POLICY "properties_public_read" ON properties
    FOR SELECT USING (
        approval_status = 'approved' AND is_published = true
    );

-- 管理员可以查看所有房源
CREATE POLICY "properties_admin_read_all" ON properties
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 房源管理员可以创建房源
CREATE POLICY "properties_admin_insert" ON properties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 房源管理员可以更新自己创建的房源，超级管理员可以更新所有房源
CREATE POLICY "properties_admin_update" ON properties
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = auth.uid() 
            AND (
                up.role = 'super_admin' OR 
                (up.role = 'admin' AND properties.created_by = auth.uid())
            )
        )
    );

-- 8. 创建房源审批相关的函数
CREATE OR REPLACE FUNCTION approve_property(
    property_id_param TEXT,
    action_param TEXT,
    reason_param TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    current_user_role TEXT;
    result JSON;
BEGIN
    -- 检查用户权限
    SELECT role INTO current_user_role 
    FROM user_profiles 
    WHERE id = auth.uid();
    
    IF current_user_role != 'super_admin' THEN
        RETURN json_build_object('success', false, 'error', '权限不足');
    END IF;
    
    -- 执行审批操作
    IF action_param = 'approve' THEN
        UPDATE properties 
        SET 
            approval_status = 'approved',
            approved_by = auth.uid(),
            approved_at = NOW()
        WHERE id = property_id_param;
        
        -- 记录审批日志
        INSERT INTO property_approval_logs (property_id, action, performed_by, reason)
        VALUES (property_id_param, 'approve', auth.uid(), reason_param);
        
    ELSIF action_param = 'reject' THEN
        UPDATE properties 
        SET 
            approval_status = 'rejected',
            rejection_reason = reason_param,
            is_published = false  -- 拒绝的房源自动取消发布
        WHERE id = property_id_param;
        
        -- 记录审批日志
        INSERT INTO property_approval_logs (property_id, action, performed_by, reason)
        VALUES (property_id_param, 'reject', auth.uid(), reason_param);
    ELSE
        RETURN json_build_object('success', false, 'error', '无效的操作');
    END IF;
    
    RETURN json_build_object('success', true, 'message', '操作成功');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. 创建获取房源统计的函数
CREATE OR REPLACE FUNCTION get_property_stats()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total', COUNT(*),
        'pending', COUNT(*) FILTER (WHERE approval_status = 'pending'),
        'approved', COUNT(*) FILTER (WHERE approval_status = 'approved'),
        'rejected', COUNT(*) FILTER (WHERE approval_status = 'rejected'),
        'published', COUNT(*) FILTER (WHERE is_published = true),
        'featured', COUNT(*) FILTER (WHERE is_featured = true)
    ) INTO stats
    FROM properties;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. 验证数据库更新
SELECT 
    'Properties table structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'properties' 
    AND table_schema = 'public'
    AND column_name IN ('approval_status', 'created_by', 'approved_by', 'approved_at', 'rejection_reason')
ORDER BY ordinal_position;

-- 检查审批日志表
SELECT 
    'Approval logs table' as info,
    COUNT(*) as total_logs
FROM property_approval_logs;

-- 检查房源审批状态分布
SELECT 
    'Property approval distribution' as info,
    approval_status,
    COUNT(*) as count
FROM properties 
GROUP BY approval_status;