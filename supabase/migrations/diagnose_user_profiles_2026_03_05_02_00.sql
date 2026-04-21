-- 检查user_profiles表的完整结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查NOT NULL约束
SELECT column_name
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
  AND is_nullable = 'NO';

-- 检查所有约束
SELECT constraint_name, constraint_type, column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_profiles' 
  AND tc.table_schema = 'public';

-- 测试最小插入
DO $$
BEGIN
    INSERT INTO public.user_profiles (id, email) 
    VALUES (gen_random_uuid(), 'test-fix@example.com');
    RAISE NOTICE 'SUCCESS: Minimal insert worked';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR: %', SQLERRM;
END $$;