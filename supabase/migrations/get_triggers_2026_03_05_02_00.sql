-- 查询触发器
SELECT 'TRIGGERS ON AUTH.USERS:' as query_type;

SELECT
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND event_object_schema = 'auth';