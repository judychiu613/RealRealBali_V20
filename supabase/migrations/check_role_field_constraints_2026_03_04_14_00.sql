-- 1. 检查user_profiles表结构，特别是role字段
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- 2. 检查role字段的具体约束
SELECT 
  column_name,
  constraint_name,
  constraint_type
FROM information_schema.constraint_column_usage ccu
JOIN information_schema.table_constraints tc 
  ON ccu.constraint_name = tc.constraint_name
WHERE ccu.table_name = 'user_profiles' 
  AND ccu.column_name = 'role';

-- 3. 检查现有user_profiles记录的role值
SELECT 
  role,
  COUNT(*) as count
FROM user_profiles 
GROUP BY role;

-- 4. 检查是否有role字段的CHECK约束
SELECT 
  tc.constraint_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'user_profiles' 
  AND tc.constraint_type = 'CHECK';