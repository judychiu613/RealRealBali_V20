-- 检查当前收藏数据
SELECT 
    COUNT(*) as total_favorites,
    COUNT(DISTINCT user_id) as unique_users
FROM public.user_favorites_map;

-- 显示所有收藏数据
SELECT 
    ufm.id,
    ufm.user_id,
    ufm.property_id,
    ufm.created_at,
    u.email
FROM public.user_favorites_map ufm
LEFT JOIN auth.users u ON ufm.user_id = u.id
ORDER BY ufm.created_at DESC;

-- 为所有用户添加更多测试收藏数据
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM auth.users LOOP
        -- 为每个用户添加多个收藏
        INSERT INTO public.user_favorites_map (user_id, property_id)
        VALUES 
            (user_record.id, 'villa-luxury-001'),
            (user_record.id, 'apartment-modern-002'),
            (user_record.id, 'land-beachfront-003'),
            (user_record.id, 'villa-traditional-004'),
            (user_record.id, 'apartment-penthouse-005')
        ON CONFLICT (user_id, property_id) DO NOTHING;
    END LOOP;
    
    RAISE NOTICE 'Added test favorites for all users';
END $$;

-- 再次检查收藏数据
SELECT 
    COUNT(*) as total_favorites_after,
    COUNT(DISTINCT user_id) as unique_users_after
FROM public.user_favorites_map;