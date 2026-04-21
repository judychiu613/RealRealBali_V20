-- =============================================
-- 后台管理系统数据库设计
-- =============================================

-- 1. 在用户档案表中添加角色字段
ALTER TABLE user_profiles 
ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('super_admin', 'property_admin', 'user'));

-- 为现有用户设置默认角色
UPDATE user_profiles SET role = 'user' WHERE role IS NULL;

-- 2. 修改properties表，添加审核流程字段
ALTER TABLE properties 
ADD COLUMN status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'unavailable', 'pending_unavailable')),
ADD COLUMN created_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;

-- 将现有房源设置为已审核状态
UPDATE properties 
SET status = 'available', 
    approved_at = NOW() 
WHERE status IS NULL AND is_published = true;

-- 3. 在user_views表中添加设备分析字段
ALTER TABLE user_views 
ADD COLUMN device_type VARCHAR(10) CHECK (device_type IN ('desktop', 'mobile')),
ADD COLUMN device_subtype VARCHAR(10) CHECK (device_subtype IN ('iphone', 'android', 'ipad')),
ADD COLUMN browser_name VARCHAR(50);

-- 4. 创建管理员操作日志表
CREATE TABLE admin_operation_logs (
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

-- 5. 创建管理员会话表（用于后台登录状态管理）
CREATE TABLE admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    session_token VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 为管理员操作日志创建索引
CREATE INDEX idx_admin_logs_operator ON admin_operation_logs(operator_id);
CREATE INDEX idx_admin_logs_target ON admin_operation_logs(target_type, target_id);
CREATE INDEX idx_admin_logs_created_at ON admin_operation_logs(created_at);

-- 7. 为user_views表的新字段创建索引
CREATE INDEX idx_user_views_device_type ON user_views(device_type);
CREATE INDEX idx_user_views_device_subtype ON user_views(device_subtype);
CREATE INDEX idx_user_views_browser ON user_views(browser_name);

-- 8. 为properties表的新字段创建索引
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_created_by ON properties(created_by);
CREATE INDEX idx_properties_approved_by ON properties(approved_by);

-- 9. 创建管理员权限视图
CREATE OR REPLACE VIEW admin_users AS
SELECT 
    u.id,
    u.email,
    up.full_name,
    up.role,
    up.created_at,
    up.updated_at
FROM auth.users u
JOIN user_profiles up ON u.id = up.user_id
WHERE up.role IN ('super_admin', 'property_admin');

-- 10. 设置RLS策略

-- 管理员操作日志表的RLS
ALTER TABLE admin_operation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view all logs" ON admin_operation_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Property admins can view own logs" ON admin_operation_logs
    FOR SELECT USING (
        operator_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Admins can insert logs" ON admin_operation_logs
    FOR INSERT WITH CHECK (
        operator_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role IN ('super_admin', 'property_admin')
        )
    );

-- 管理员会话表的RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions" ON admin_sessions
    FOR ALL USING (user_id = auth.uid());

-- 11. 创建一些测试管理员账户（需要手动设置）
-- 注意：这些需要在实际部署时手动创建用户并设置角色

-- 示例：设置超级管理员
-- UPDATE user_profiles 
-- SET role = 'super_admin' 
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@realreal.com');

-- 示例：设置房源管理员
-- UPDATE user_profiles 
-- SET role = 'property_admin' 
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'property@realreal.com');

COMMENT ON TABLE admin_operation_logs IS '管理员操作日志表';
COMMENT ON TABLE admin_sessions IS '管理员会话管理表';
COMMENT ON COLUMN properties.status IS '房源状态：pending(待审核), available(已上架), unavailable(已下架), pending_unavailable(申请下架)';
COMMENT ON COLUMN properties.created_by IS '房源创建者ID';
COMMENT ON COLUMN properties.approved_by IS '房源审核者ID';
COMMENT ON COLUMN user_views.device_type IS '设备类型：desktop或mobile';
COMMENT ON COLUMN user_views.device_subtype IS '移动设备子类型：iphone, android, ipad';
COMMENT ON COLUMN user_views.browser_name IS '浏览器名称';