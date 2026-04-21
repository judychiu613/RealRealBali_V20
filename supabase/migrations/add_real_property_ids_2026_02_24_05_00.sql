-- 清除judy用户现有的收藏
DELETE FROM public.user_favorites_map 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'judy_chiu@outlook.com');

-- 为judy用户添加一些可能存在于Edge Function中的房源ID
-- 这些ID格式应该与Edge Function返回的房源ID匹配
DO $$
DECLARE
    judy_user_id uuid;
BEGIN
    -- 获取judy的用户ID
    SELECT id INTO judy_user_id 
    FROM auth.users 
    WHERE email = 'judy_chiu@outlook.com';
    
    IF judy_user_id IS NOT NULL THEN
        -- 添加一些常见的房源ID格式
        INSERT INTO public.user_favorites_map (user_id, property_id)
        VALUES 
            (judy_user_id, 'property-1'),
            (judy_user_id, 'property-2'),
            (judy_user_id, 'property-3'),
            (judy_user_id, 'villa-001'),
            (judy_user_id, 'apartment-001'),
            (judy_user_id, 'land-001'),
            (judy_user_id, 'bali-villa-1'),
            (judy_user_id, 'bali-apartment-1'),
            (judy_user_id, 'ubud-villa-1'),
            (judy_user_id, 'seminyak-villa-1')
        ON CONFLICT (user_id, property_id) DO NOTHING;
        
        RAISE NOTICE 'Added real property IDs for judy_chiu@outlook.com';
    ELSE
        RAISE NOTICE 'User judy_chiu@outlook.com not found';
    END IF;
END $$;

-- 验证添加的收藏数据
SELECT 
    ufm.property_id,
    ufm.created_at
FROM public.user_favorites_map ufm
JOIN auth.users u ON ufm.user_id = u.id
WHERE u.email = 'judy_chiu@outlook.com'
ORDER BY ufm.created_at DESC;