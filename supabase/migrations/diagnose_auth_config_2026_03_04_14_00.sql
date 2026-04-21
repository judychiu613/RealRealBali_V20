-- 1. 检查auth schema是否存在
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'auth';

-- 2. 检查auth.users表结构
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. 检查是否有auth.users的记录
SELECT COUNT(*) as total_auth_users 
FROM auth.users;

-- 4. 检查最近的auth.users记录（不显示敏感信息）
SELECT 
  id, 
  email, 
  created_at,
  email_confirmed_at,
  CASE WHEN raw_user_meta_data IS NOT NULL THEN 'Has metadata' ELSE 'No metadata' END as metadata_status
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 3;