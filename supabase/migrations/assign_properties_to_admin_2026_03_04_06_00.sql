-- 1. 查找超级管理员用户
SELECT 
    'Super admin user' as info,
    up.id,
    up.email,
    up.full_name,
    up.role,
    au.email as auth_email
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE up.role = 'super_admin'
LIMIT 1;

-- 2. 更新现有房源的创建者和审批者
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- 获取超级管理员用户ID
    SELECT id INTO admin_user_id 
    FROM user_profiles 
    WHERE role = 'super_admin' 
    LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        -- 更新所有房源的创建者和审批者
        UPDATE properties 
        SET 
            created_by = admin_user_id,
            approved_by = admin_user_id,
            approval_status = 'approved',
            approved_at = COALESCE(approved_at, created_at)
        WHERE created_by IS NULL OR approved_by IS NULL;
        
        -- 记录操作日志
        INSERT INTO property_approval_logs (property_id, action, performed_by, reason)
        SELECT 
            id,
            'approve',
            admin_user_id,
            'Batch approval by system admin'
        FROM properties 
        WHERE approval_status = 'approved'
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Updated properties with admin user: %', admin_user_id;
    ELSE
        RAISE NOTICE 'No super admin user found';
    END IF;
END $$;

-- 3. 验证更新结果
SELECT 
    'Properties after update' as info,
    p.id,
    p.title_zh,
    p.approval_status,
    p.is_published,
    creator.email as created_by_email,
    approver.email as approved_by_email,
    p.created_at,
    p.approved_at
FROM properties p
LEFT JOIN user_profiles creator ON p.created_by = creator.id
LEFT JOIN user_profiles approver ON p.approved_by = approver.id
ORDER BY p.created_at DESC
LIMIT 10;

-- 4. 检查审批日志
SELECT 
    'Approval logs' as info,
    COUNT(*) as total_logs,
    action,
    performer.email as performed_by_email
FROM property_approval_logs pal
LEFT JOIN user_profiles performer ON pal.performed_by = performer.id
GROUP BY action, performer.email
ORDER BY COUNT(*) DESC;