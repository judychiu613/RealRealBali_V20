-- 检查当前收藏表结构
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_favorites_map' 
ORDER BY ordinal_position;

-- 检查现有索引
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'user_favorites_map';

-- 检查RLS策略
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
WHERE tablename = 'user_favorites_map';

-- 添加复合索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_user_favorites_compound 
ON public.user_favorites_map(user_id, property_id);

-- 添加property_id索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_lookup 
ON public.user_favorites_map(property_id, user_id);

-- 优化RLS策略，使用更高效的策略
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.user_favorites_map;

-- 创建更高效的RLS策略
CREATE POLICY "users_select_own_favorites" ON public.user_favorites_map
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_favorites" ON public.user_favorites_map
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_favorites" ON public.user_favorites_map
    FOR DELETE USING (auth.uid() = user_id);

-- 分析表以更新统计信息
ANALYZE public.user_favorites_map;