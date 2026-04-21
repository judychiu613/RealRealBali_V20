-- 为不同房源分配不同的图片
UPDATE public.properties_final_2026_02_21_17_30 
SET 
    main_image = CASE 
        WHEN id = 'prop-001' THEN '/src/assets/images/villa_1.jpg'
        WHEN id = 'prop-002' THEN '/src/assets/images/villa_2.jpg'
        WHEN id = 'prop-003' THEN '/src/assets/images/modern_house_1.jpg'
        WHEN id = 'prop-004' THEN '/src/assets/images/pool_villa_21.jpg'
        WHEN id = 'prop-005' THEN '/src/assets/images/villa_3.jpg'
        WHEN id = 'prop-006' THEN '/src/assets/images/modern_house_2.jpg'
        WHEN id = 'prop-007' THEN '/src/assets/images/pool_villa_22.jpg'
        WHEN id = 'prop-008' THEN '/src/assets/images/villa_4.jpg'
        WHEN id = 'prop-009' THEN '/src/assets/images/modern_house_3.jpg'
        WHEN id = 'prop-010' THEN '/src/assets/images/pool_villa_23.jpg'
        ELSE '/src/assets/images/villa_5.jpg'
    END,
    images = CASE 
        WHEN id = 'prop-001' THEN ARRAY['/src/assets/images/villa_1.jpg', '/src/assets/images/pool_villa_25.jpg', '/src/assets/images/modern_house_8.jpg']
        WHEN id = 'prop-002' THEN ARRAY['/src/assets/images/villa_2.jpg', '/src/assets/images/pool_villa_26.jpg', '/src/assets/images/modern_house_4.jpg']
        WHEN id = 'prop-003' THEN ARRAY['/src/assets/images/modern_house_1.jpg', '/src/assets/images/villa_6.jpg', '/src/assets/images/pool_villa_27.jpg']
        WHEN id = 'prop-004' THEN ARRAY['/src/assets/images/pool_villa_21.jpg', '/src/assets/images/villa_7.jpg', '/src/assets/images/modern_house_5.jpg']
        WHEN id = 'prop-005' THEN ARRAY['/src/assets/images/villa_3.jpg', '/src/assets/images/pool_villa_28.jpg', '/src/assets/images/modern_house_6.jpg']
        WHEN id = 'prop-006' THEN ARRAY['/src/assets/images/modern_house_2.jpg', '/src/assets/images/villa_8.jpg', '/src/assets/images/pool_villa_24.jpg']
        WHEN id = 'prop-007' THEN ARRAY['/src/assets/images/pool_villa_22.jpg', '/src/assets/images/villa_9.jpg', '/src/assets/images/modern_house_7.jpg']
        WHEN id = 'prop-008' THEN ARRAY['/src/assets/images/villa_4.jpg', '/src/assets/images/pool_villa_29.jpg', '/src/assets/images/modern_house_8.jpg']
        WHEN id = 'prop-009' THEN ARRAY['/src/assets/images/modern_house_3.jpg', '/src/assets/images/villa_10.jpg', '/src/assets/images/pool_villa_30.jpg']
        WHEN id = 'prop-010' THEN ARRAY['/src/assets/images/pool_villa_23.jpg', '/src/assets/images/villa_5.jpg', '/src/assets/images/modern_house_1.jpg']
        ELSE ARRAY['/src/assets/images/villa_5.jpg', '/src/assets/images/pool_villa_25.jpg']
    END;