-- 清除之前添加的假数据
DELETE FROM public.user_favorites_map 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'judy_chiu@outlook.com');

-- 恢复您的原始收藏数据
DO $$
DECLARE
    judy_user_id uuid;
BEGIN
    SELECT id INTO judy_user_id 
    FROM auth.users 
    WHERE email = 'judy_chiu@outlook.com';
    
    IF judy_user_id IS NOT NULL THEN
        -- 添加您提到的原始收藏房源ID
        INSERT INTO public.user_favorites_map (user_id, property_id)
        VALUES 
            (judy_user_id, 'prop-008'),
            (judy_user_id, 'villa-009')
        ON CONFLICT (user_id, property_id) DO NOTHING;
        
        RAISE NOTICE 'Restored original favorites for judy_chiu@outlook.com';
    END IF;
END $$;

-- 验证恢复的数据
SELECT 
    ufm.property_id,
    ufm.created_at
FROM public.user_favorites_map ufm
JOIN auth.users u ON ufm.user_id = u.id
WHERE u.email = 'judy_chiu@outlook.com'
ORDER BY ufm.created_at DESC;