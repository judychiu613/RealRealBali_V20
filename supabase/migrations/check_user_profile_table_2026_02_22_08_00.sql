-- 检查用户资料表是否存在
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles_2026_02_21_06_55'
ORDER BY ordinal_position;

-- 检查RLS策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles_2026_02_21_06_55';