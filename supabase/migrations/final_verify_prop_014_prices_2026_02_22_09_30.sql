-- 最终验证prop-014的数据库价格
SELECT 
    id,
    title_en,
    price_usd,
    price_cny,
    price_idr,
    -- 格式化显示
    '$' || TO_CHAR(price_usd, 'FM999,999,999') as formatted_usd,
    '¥' || TO_CHAR(price_cny, 'FM999,999,999') as formatted_cny,
    'Rp' || TO_CHAR(price_idr, 'FM999,999,999,999') as formatted_idr
FROM public.properties_final_2026_02_21_17_30 
WHERE id = 'prop-014';