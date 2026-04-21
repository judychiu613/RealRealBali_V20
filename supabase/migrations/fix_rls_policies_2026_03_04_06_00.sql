-- 1. 首先禁用所有表的RLS，然后重新设置简单的策略
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_operation_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;

-- 2. 删除所有可能有问题的策略
DROP POLICY IF EXISTS "properties_select_policy" ON properties;
DROP POLICY IF EXISTS "properties_insert_policy" ON properties;
DROP POLICY IF EXISTS "properties_update_policy" ON properties;
DROP POLICY IF EXISTS "properties_delete_policy" ON properties;

DROP POLICY IF EXISTS "property_images_select_policy" ON property_images;
DROP POLICY IF EXISTS "property_images_insert_policy" ON property_images;
DROP POLICY IF EXISTS "property_images_update_policy" ON property_images;
DROP POLICY IF EXISTS "property_images_delete_policy" ON property_images;

DROP POLICY IF EXISTS "user_roles_select_policy" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert_policy" ON user_roles;
DROP POLICY IF EXISTS "user_roles_update_policy" ON user_roles;
DROP POLICY IF EXISTS "user_roles_delete_policy" ON user_roles;

DROP POLICY IF EXISTS "user_views_select_policy" ON user_views;
DROP POLICY IF EXISTS "user_views_insert_policy" ON user_views;

DROP POLICY IF EXISTS "admin_operation_logs_select_policy" ON admin_operation_logs;
DROP POLICY IF EXISTS "admin_operation_logs_insert_policy" ON admin_operation_logs;

DROP POLICY IF EXISTS "admin_sessions_select_policy" ON admin_sessions;
DROP POLICY IF EXISTS "admin_sessions_insert_policy" ON admin_sessions;
DROP POLICY IF EXISTS "admin_sessions_update_policy" ON admin_sessions;
DROP POLICY IF EXISTS "admin_sessions_delete_policy" ON admin_sessions;

-- 3. 为properties表创建简单的策略（公开读取）
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_public_read" ON properties
    FOR SELECT USING (true);

CREATE POLICY "properties_authenticated_write" ON properties
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. 为property_images表创建简单的策略（公开读取）
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_images_public_read" ON property_images
    FOR SELECT USING (true);

CREATE POLICY "property_images_authenticated_write" ON property_images
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. 为user_roles表创建简单的策略（避免递归）
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_own_record" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "user_roles_insert_own" ON user_roles
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_roles_update_own" ON user_roles
    FOR UPDATE USING (user_id = auth.uid());

-- 6. 为user_views表创建简单的策略
ALTER TABLE user_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_views_public_read" ON user_views
    FOR SELECT USING (true);

CREATE POLICY "user_views_public_insert" ON user_views
    FOR INSERT WITH CHECK (true);

-- 7. 管理员表的策略（只有管理员可以访问）
ALTER TABLE admin_operation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_logs_admin_only" ON admin_operation_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "admin_sessions_admin_only" ON admin_sessions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('super_admin', 'admin')
        )
    );

-- 8. 验证策略设置
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;