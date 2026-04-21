-- 查询NOT NULL字段
SELECT 'NOT NULL FIELDS:' as query_type;

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
AND is_nullable = 'NO'
ORDER BY ordinal_position;