-- 检查email字段的约束
SELECT column_name, data_type, is_nullable, column_default, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
  AND column_name = 'email';

-- 检查email相关的约束
SELECT tc.constraint_name, tc.constraint_type, kcu.column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'user_profiles' 
  AND tc.table_schema = 'public'
  AND kcu.column_name = 'email';

-- 如果email是NOT NULL但没有默认值，设置为可空
ALTER TABLE public.user_profiles 
ALTER COLUMN email DROP NOT NULL;

-- 测试插入包含email
DO $$
BEGIN
    INSERT INTO public.user_profiles (id, email) 
    VALUES (gen_random_uuid(), 'email-test@example.com');
    RAISE NOTICE 'SUCCESS: Email insert worked';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EMAIL INSERT ERROR: %', SQLERRM;
END $$;