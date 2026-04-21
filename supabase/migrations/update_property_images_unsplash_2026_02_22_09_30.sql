-- 更新房源图片为正确的Unsplash URL
UPDATE public.properties_final_2026_02_21_17_30 
SET 
    main_image = CASE 
        WHEN id = 'prop-001' THEN 'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN id = 'prop-002' THEN 'https://images.unsplash.com/photo-1728048756938-de1ccee0ab15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN id = 'prop-003' THEN 'https://images.unsplash.com/photo-1728049006379-f1f2c3dbb910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwdmlsbGElMjBiYWxpfGVufDB8MHx8fDE3NzE3NTE0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN id = 'prop-004' THEN 'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN id = 'prop-005' THEN 'https://images.unsplash.com/photo-1728050829093-9ee62013968a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN id = 'prop-006' THEN 'https://images.unsplash.com/photo-1728049006363-f8e583040180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN id = 'prop-007' THEN 'https://images.unsplash.com/photo-1728049006339-1cc328a28ab0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw4fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN id = 'prop-008' THEN 'https://images.unsplash.com/photo-1728048756857-d1ed820ea0e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN id = 'prop-009' THEN 'https://images.unsplash.com/photo-1728050829092-acd5cc835d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        WHEN id = 'prop-010' THEN 'https://images.unsplash.com/photo-1728048756779-ed7f123d371f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        ELSE 'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
    END,
    images = CASE 
        WHEN id = 'prop-001' THEN ARRAY[
            'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1728050829052-2d1514f1d168?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080'
        ]
        WHEN id = 'prop-002' THEN ARRAY[
            'https://images.unsplash.com/photo-1728048756938-de1ccee0ab15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1762117361030-a23ec89aa218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw0fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1728049006379-f1f2c3dbb910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwdmlsbGElMjBiYWxpfGVufDB8MHx8fDE3NzE3NTE0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
        ]
        WHEN id = 'prop-003' THEN ARRAY[
            'https://images.unsplash.com/photo-1728049006379-f1f2c3dbb910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHwxMHx8bHV4dXJ5JTIwdmlsbGElMjBiYWxpfGVufDB8MHx8fDE3NzE3NTE0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1728049006363-f8e583040180?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw2fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1764339441207-c55b7ae4a15e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHw1fHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]
        ELSE ARRAY[
            'https://images.unsplash.com/photo-1728049006343-9ee0187643d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU5NTF8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjB2aWxsYSUyMGJhbGl8ZW58MHwwfHx8MTc3MTc1MTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
            'https://images.unsplash.com/photo-1762117360890-5eacdbb07b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwzfHx0cm9waWNhbCUyMHByb3BlcnR5JTIwcG9vbHxlbnwwfDB8fHwxNzcxNzUxNDUyfDA&ixlib=rb-4.1.0&q=80&w=1080'
        ]
    END;