-- 查询user_profiles表结构
SELECT 'USER_PROFILES STRUCTURE:' as query_type;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
ORDER BY ordinal_position;