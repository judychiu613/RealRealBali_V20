-- 查找judy_chiu@outlook.com用户
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'judy_chiu@outlook.com';

-- 检查该用户的收藏数据
SELECT 
    ufm.id,
    ufm.user_id,
    ufm.property_id,
    ufm.created_at
FROM public.user_favorites_map ufm
JOIN auth.users u ON ufm.user_id = u.id
WHERE u.email = 'judy_chiu@outlook.com'
ORDER BY ufm.created_at DESC;

-- 检查所有收藏数据
SELECT 
    COUNT(*) as total_favorites,
    COUNT(DISTINCT user_id) as unique_users
FROM public.user_favorites_map;

-- 为judy_chiu@outlook.com用户手动添加收藏数据
DO $$
DECLARE
    judy_user_id uuid;
BEGIN
    -- 获取judy的用户ID
    SELECT id INTO judy_user_id 
    FROM auth.users 
    WHERE email = 'judy_chiu@outlook.com';
    
    IF judy_user_id IS NOT NULL THEN
        -- 删除现有的收藏（如果有的话）
        DELETE FROM public.user_favorites_map 
        WHERE user_id = judy_user_id;
        
        -- 添加新的收藏数据
        INSERT INTO public.user_favorites_map (user_id, property_id)
        VALUES 
            (judy_user_id, 'villa-luxury-beachfront'),
            (judy_user_id, 'apartment-modern-ubud'),
            (judy_user_id, 'land-investment-canggu'),
            (judy_user_id, 'villa-traditional-sanur'),
            (judy_user_id, 'penthouse-seminyak')
        ON CONFLICT (user_id, property_id) DO NOTHING;
        
        RAISE NOTICE 'Added 5 favorites for judy_chiu@outlook.com (user_id: %)', judy_user_id;
    ELSE
        RAISE NOTICE 'User judy_chiu@outlook.com not found';
    END IF;
END $$;

-- 验证添加的收藏数据
SELECT 
    ufm.id,
    ufm.user_id,
    ufm.property_id,
    ufm.created_at,
    u.email
FROM public.user_favorites_map ufm
JOIN auth.users u ON ufm.user_id = u.id
WHERE u.email = 'judy_chiu@outlook.com'
ORDER BY ufm.created_at DESC;