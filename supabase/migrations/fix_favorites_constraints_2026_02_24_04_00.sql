-- 首先检查外键约束
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'user_favorites_map';

-- 检查是否有properties表
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'properties'
) as properties_table_exists;

-- 如果properties表不存在，移除外键约束
DO $$
BEGIN
    -- 检查并删除property_id的外键约束
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_favorites_map_property_id_fkey' 
        AND table_name = 'user_favorites_map'
    ) THEN
        ALTER TABLE public.user_favorites_map 
        DROP CONSTRAINT user_favorites_map_property_id_fkey;
        RAISE NOTICE 'Dropped foreign key constraint user_favorites_map_property_id_fkey';
    END IF;
END $$;

-- 检查收藏表中的数据
SELECT COUNT(*) as total_favorites FROM public.user_favorites_map;

-- 检查用户数量
SELECT COUNT(*) as total_users FROM auth.users;

-- 插入一些测试数据（如果没有数据的话）
DO $$
DECLARE
    test_user_id uuid;
BEGIN
    -- 获取第一个用户ID
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- 插入测试收藏数据
        INSERT INTO public.user_favorites_map (user_id, property_id)
        VALUES 
            (test_user_id, 'villa-001'),
            (test_user_id, 'apartment-002'),
            (test_user_id, 'land-003')
        ON CONFLICT (user_id, property_id) DO NOTHING;
        
        RAISE NOTICE 'Test favorites inserted for user: %', test_user_id;
    ELSE
        RAISE NOTICE 'No users found in auth.users table';
    END IF;
END $$;

-- 再次检查收藏数据
SELECT 
    id,
    user_id,
    property_id,
    created_at
FROM public.user_favorites_map 
ORDER BY created_at DESC;