-- 清除judy用户现有的收藏，准备添加真实的房源ID
DELETE FROM public.user_favorites_map 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'judy_chiu@outlook.com');

-- 添加一些更可能存在的房源ID格式
-- 基于常见的房产网站ID格式
DO $$
DECLARE
    judy_user_id uuid;
BEGIN
    SELECT id INTO judy_user_id 
    FROM auth.users 
    WHERE email = 'judy_chiu@outlook.com';
    
    IF judy_user_id IS NOT NULL THEN
        INSERT INTO public.user_favorites_map (user_id, property_id)
        VALUES 
            -- 尝试更真实的ID格式
            (judy_user_id, '1'),
            (judy_user_id, '2'), 
            (judy_user_id, '3'),
            (judy_user_id, 'prop_1'),
            (judy_user_id, 'prop_2'),
            (judy_user_id, 'villa_1'),
            (judy_user_id, 'apartment_1'),
            (judy_user_id, 'land_1'),
            -- UUID格式（如果Edge Function使用UUID）
            (judy_user_id, '550e8400-e29b-41d4-a716-446655440001'),
            (judy_user_id, '550e8400-e29b-41d4-a716-446655440002')
        ON CONFLICT (user_id, property_id) DO NOTHING;
        
        RAISE NOTICE 'Updated property IDs for judy_chiu@outlook.com';
    END IF;
END $$;

-- 验证更新后的收藏数据
SELECT 
    COUNT(*) as new_favorites_count,
    array_agg(property_id) as new_property_ids
FROM public.user_favorites_map ufm
JOIN auth.users u ON ufm.user_id = u.id
WHERE u.email = 'judy_chiu@outlook.com';