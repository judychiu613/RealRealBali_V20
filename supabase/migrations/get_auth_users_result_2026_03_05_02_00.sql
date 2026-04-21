-- 查询最近的auth用户
SELECT 'AUTH USERS QUERY RESULT:' as query_type;

SELECT id, email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;