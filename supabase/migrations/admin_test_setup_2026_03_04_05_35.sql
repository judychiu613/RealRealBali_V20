-- =============================================
-- 创建测试管理员账户和数据更新
-- =============================================

-- 1. 创建测试管理员账户的函数（需要手动执行）
-- 注意：这些账户需要先在Supabase Auth中创建，然后运行下面的SQL来设置角色

-- 示例：设置超级管理员（需要替换为实际的用户ID）
-- 首先在Supabase Auth中创建用户：admin@realreal.com
-- 然后运行以下SQL（替换user_id为实际ID）:

/*
-- 设置超级管理员角色
INSERT INTO user_roles (user_id, role) 
VALUES ('替换为实际的用户ID', 'super_admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super_admin', updated_at = NOW();

-- 设置房源管理员角色
INSERT INTO user_roles (user_id, role) 
VALUES ('替换为实际的用户ID', 'property_admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'property_admin', updated_at = NOW();
*/

-- 2. 查看当前所有用户及其角色
SELECT 
    u.id,
    u.email,
    ur.role,
    ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY ur.created_at DESC;

-- 3. 统计当前数据库状态
SELECT 
    'Properties' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as available_count,
    COUNT(CASE WHEN status = 'unavailable' THEN 1 END) as unavailable_count
FROM properties
UNION ALL
SELECT 
    'User Views' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN device_type IS NOT NULL THEN 1 END) as with_device_info,
    COUNT(CASE WHEN device_type IS NULL THEN 1 END) as without_device_info,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as registered_users
FROM user_views
UNION ALL
SELECT 
    'User Roles' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admins,
    COUNT(CASE WHEN role = 'property_admin' THEN 1 END) as property_admins,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users
FROM user_roles;

-- 4. 创建一个函数来批量更新现有user_views的设备信息
-- 这个函数会调用Edge Function来解析User-Agent
CREATE OR REPLACE FUNCTION update_user_views_device_info()
RETURNS TEXT AS $$
DECLARE
    result_text TEXT;
BEGIN
    -- 这里只是一个占位符函数
    -- 实际的设备信息更新需要通过Edge Function进行
    -- 可以通过以下方式调用：
    -- 1. 直接访问 Edge Function: /user_agent_parser_2026_03_04_05_35?action=batch_update&limit=100
    -- 2. 或者在前端管理界面中添加一个"更新设备信息"按钮
    
    SELECT COUNT(*) || ' records need device info update' 
    INTO result_text
    FROM user_views 
    WHERE device_type IS NULL AND user_agent IS NOT NULL;
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql;

-- 5. 检查需要更新设备信息的记录数量
SELECT update_user_views_device_info();

-- 6. 创建一些示例房源数据用于测试（如果需要）
-- 注意：这需要有效的created_by用户ID

/*
-- 示例：创建测试房源（需要替换created_by为实际的管理员用户ID）
INSERT INTO properties (
    title_zh, title_en, type_id, price_usd, area_id, 
    created_by, status, is_published
) VALUES 
(
    '测试别墅 - 待审核', 
    'Test Villa - Pending', 
    'villa', 
    500000, 
    'ubud',
    '替换为实际的用户ID',
    'pending',
    false
),
(
    '测试土地 - 已上架', 
    'Test Land - Available', 
    'land', 
    200000, 
    'canggu',
    '替换为实际的用户ID',
    'available',
    true
);
*/

-- 7. 创建操作日志查询视图
CREATE OR REPLACE VIEW admin_operation_summary AS
SELECT 
    DATE(created_at) as operation_date,
    operation_type,
    COUNT(*) as operation_count,
    COUNT(DISTINCT operator_id) as unique_operators
FROM admin_operation_logs
GROUP BY DATE(created_at), operation_type
ORDER BY operation_date DESC, operation_count DESC;

-- 8. 查看最近的操作日志摘要
SELECT * FROM admin_operation_summary LIMIT 10;

COMMENT ON FUNCTION update_user_views_device_info() IS '检查需要更新设备信息的user_views记录数量';
COMMENT ON VIEW admin_operation_summary IS '管理员操作日志摘要视图';