-- 检查收藏表是否存在
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name LIKE '%favorite%' OR table_name LIKE '%user_favorite%'
ORDER BY table_name, ordinal_position;

-- 检查收藏表的RLS策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename LIKE '%favorite%' OR tablename LIKE '%user_favorite%';