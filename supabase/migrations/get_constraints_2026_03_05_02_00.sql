-- 查询约束
SELECT 'CONSTRAINTS:' as query_type;

SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name = 'user_profiles'
ORDER BY tc.constraint_type, tc.constraint_name;