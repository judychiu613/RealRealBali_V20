-- =============================================
-- 后台管理系统数据库设计 - 基于现有表结构
-- =============================================

-- 1. 创建用户角色表（如果不存在user_profiles表）
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('super_admin', 'property_admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 为现有用户创建默认角色记录
INSERT INTO user_roles (user_id, role)
SELECT id, 'user' 
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM user_roles);

-- 2. 修改properties表，添加审核流程字段
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('pending', 'available', 'unavailable', 'pending_unavailable')),
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- 将现有房源设置为已审核状态
UPDATE properties 
SET status = 'available', 
    approved_at = NOW() 
WHERE status IS NULL OR status = 'available';

-- 3. 在user_views表中添加设备分析字段
ALTER TABLE user_views 
ADD COLUMN IF NOT EXISTS device_type VARCHAR(10) CHECK (device_type IN ('desktop', 'mobile')),
ADD COLUMN IF NOT EXISTS device_subtype VARCHAR(10) CHECK (device_subtype IN ('iphone', 'android', 'ipad')),
ADD COLUMN IF NOT EXISTS browser_name VARCHAR(50);

-- 4. 创建管理员操作日志表
CREATE TABLE IF NOT EXISTS admin_operation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    operator_id UUID NOT NULL REFERENCES auth.users(id),
    operation_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) NOT NULL, -- 'property', 'user', etc.
    target_id VARCHAR(255) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 创建管理员会话表
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    session_token VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 创建索引
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_admin_logs_operator ON admin_operation_logs(operator_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_operation_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_operation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_views_device_type ON user_views(device_type);
CREATE INDEX IF NOT EXISTS idx_user_views_device_subtype ON user_views(device_subtype);
CREATE INDEX IF NOT EXISTS idx_user_views_browser ON user_views(browser_name);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON properties(created_by);
CREATE INDEX IF NOT EXISTS idx_properties_approved_by ON properties(approved_by);

-- 7. 创建管理员权限视图
CREATE OR REPLACE VIEW admin_users AS
SELECT 
    u.id,
    u.email,
    ur.role,
    ur.created_at,
    ur.updated_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role IN ('super_admin', 'property_admin');

-- 8. 设置RLS策略

-- 用户角色表的RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all roles" ON user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Super admins can update roles" ON user_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- 管理员操作日志表的RLS
ALTER TABLE admin_operation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view all logs" ON admin_operation_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Property admins can view own logs" ON admin_operation_logs
    FOR SELECT USING (
        operator_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Admins can insert logs" ON admin_operation_logs
    FOR INSERT WITH CHECK (
        operator_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role IN ('super_admin', 'property_admin')
        )
    );

-- 管理员会话表的RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions" ON admin_sessions
    FOR ALL USING (user_id = auth.uid());

-- Properties表的管理员权限策略
CREATE POLICY "Property admins can view own properties" ON properties
    FOR SELECT USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Property admins can insert properties" ON properties
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role IN ('super_admin', 'property_admin')
        )
    );

CREATE POLICY "Property admins can update own properties" ON properties
    FOR UPDATE USING (
        (created_by = auth.uid() AND status IN ('pending', 'pending_unavailable')) OR
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- 9. 创建触发器函数用于自动记录操作日志
CREATE OR REPLACE FUNCTION log_property_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- 只在状态改变时记录日志
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO admin_operation_logs (
            operator_id,
            operation_type,
            target_type,
            target_id,
            old_status,
            new_status,
            description
        ) VALUES (
            auth.uid(),
            'status_change',
            'property',
            NEW.id,
            OLD.status,
            NEW.status,
            CASE 
                WHEN NEW.status = 'available' THEN '房源审核通过'
                WHEN NEW.status = 'unavailable' THEN '房源下架'
                WHEN NEW.status = 'pending_unavailable' THEN '申请下架'
                ELSE '状态变更'
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器
DROP TRIGGER IF EXISTS property_status_change_log ON properties;
CREATE TRIGGER property_status_change_log
    AFTER UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION log_property_status_change();

-- 10. 创建更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为user_roles表添加更新时间戳触发器
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE user_roles IS '用户角色表';
COMMENT ON TABLE admin_operation_logs IS '管理员操作日志表';
COMMENT ON TABLE admin_sessions IS '管理员会话管理表';
COMMENT ON COLUMN properties.status IS '房源状态：pending(待审核), available(已上架), unavailable(已下架), pending_unavailable(申请下架)';
COMMENT ON COLUMN properties.created_by IS '房源创建者ID';
COMMENT ON COLUMN properties.approved_by IS '房源审核者ID';
COMMENT ON COLUMN user_views.device_type IS '设备类型：desktop或mobile';
COMMENT ON COLUMN user_views.device_subtype IS '移动设备子类型：iphone, android, ipad';
COMMENT ON COLUMN user_views.browser_name IS '浏览器名称';