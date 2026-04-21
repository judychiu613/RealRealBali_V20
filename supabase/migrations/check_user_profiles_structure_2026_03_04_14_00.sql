-- 查看user_profiles表的完整字段结构
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 查看表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'user_profiles';