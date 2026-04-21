-- 检查prop-014的价格数据
SELECT 
    id,
    title_en,
    price_usd,
    price_cny,
    price_idr,
    created_at,
    updated_at
FROM public.properties_final_2026_02_21_17_30 
WHERE id = 'prop-014';

-- 检查所有房源的价格数据
SELECT 
    id,
    title_en,
    price_usd,
    price_cny,
    price_idr
FROM public.properties_final_2026_02_21_17_30 
ORDER BY id
LIMIT 10;