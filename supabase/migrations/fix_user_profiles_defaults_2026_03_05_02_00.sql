-- 修复user_profiles表的NOT NULL字段，添加默认值
ALTER TABLE public.user_profiles 
ALTER COLUMN role SET DEFAULT 'user';

ALTER TABLE public.user_profiles 
ALTER COLUMN is_active SET DEFAULT true;

ALTER TABLE public.user_profiles 
ALTER COLUMN preferred_language SET DEFAULT 'zh';

ALTER TABLE public.user_profiles 
ALTER COLUMN preferred_currency SET DEFAULT 'CNY';

ALTER TABLE public.user_profiles 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE public.user_profiles 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- 测试修复后的插入
DO $$
BEGIN
    INSERT INTO public.user_profiles (id, email) 
    VALUES (gen_random_uuid(), 'test-after-fix@example.com');
    RAISE NOTICE 'SUCCESS: Insert after fix worked';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR AFTER FIX: %', SQLERRM;
END $$;