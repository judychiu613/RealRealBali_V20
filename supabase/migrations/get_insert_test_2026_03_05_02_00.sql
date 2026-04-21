-- 手动插入测试
SELECT 'MANUAL INSERT TEST:' as query_type;

DO $$
BEGIN
    INSERT INTO public.user_profiles (
        id,
        email
    )
    VALUES (
        gen_random_uuid(),
        'audit-test-' || extract(epoch from now()) || '@example.com'
    );
    
    RAISE NOTICE 'INSERT SUCCESS: Manual insert worked';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'INSERT FAILED: %', SQLERRM;
END $$;