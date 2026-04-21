-- 查询RLS策略
SELECT 'RLS POLICIES:' as query_type;

SELECT 
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
AND schemaname = 'public';