-- 检查user_profiles表的完整结构
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 检查表的约束
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'user_profiles' 
  AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, kcu.column_name;

-- 测试插入最小必填字段
DO $$
DECLARE
    test_id uuid := gen_random_uuid();
    test_email text := 'constraint-test@example.com';
BEGIN
    -- 测试1: 只有id和email
    BEGIN
        INSERT INTO public.user_profiles (id, email) 
        VALUES (test_id, test_email);
        DELETE FROM public.user_profiles WHERE id = test_id;
        RAISE NOTICE 'Test 1 SUCCESS: id + email only';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Test 1 FAILED: id + email only - %', SQLERRM;
    END;
    
    -- 测试2: 添加role字段
    BEGIN
        INSERT INTO public.user_profiles (id, email, role) 
        VALUES (test_id, test_email, 'user');
        DELETE FROM public.user_profiles WHERE id = test_id;
        RAISE NOTICE 'Test 2 SUCCESS: id + email + role';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Test 2 FAILED: id + email + role - %', SQLERRM;
    END;
    
    -- 测试3: 添加时间戳
    BEGIN
        INSERT INTO public.user_profiles (id, email, role, created_at, updated_at) 
        VALUES (test_id, test_email, 'user', NOW(), NOW());
        DELETE FROM public.user_profiles WHERE id = test_id;
        RAISE NOTICE 'Test 3 SUCCESS: id + email + role + timestamps';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Test 3 FAILED: id + email + role + timestamps - %', SQLERRM;
    END;
    
    -- 测试4: 添加所有可能的必填字段
    BEGIN
        INSERT INTO public.user_profiles (
            id, email, role, created_at, updated_at,
            full_name, preferred_language, preferred_currency, is_active
        ) 
        VALUES (
            test_id, test_email, 'user', NOW(), NOW(),
            '', 'zh', 'CNY', true
        );
        DELETE FROM public.user_profiles WHERE id = test_id;
        RAISE NOTICE 'Test 4 SUCCESS: All common fields';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Test 4 FAILED: All common fields - %', SQLERRM;
    END;
END $$;