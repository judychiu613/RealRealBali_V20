-- 详细检查prop-014的数据库价格
SELECT 
    id,
    title_en,
    price_usd,
    price_cny,
    price_idr,
    TO_CHAR(price_usd, 'FM999,999,999') as formatted_usd,
    TO_CHAR(price_cny, 'FM999,999,999') as formatted_cny,
    TO_CHAR(price_idr, 'FM999,999,999,999') as formatted_idr
FROM public.properties_final_2026_02_21_17_30 
WHERE id = 'prop-014';

-- 检查是否有其他价格相关的字段
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'properties_final_2026_02_21_17_30'
AND column_name LIKE '%price%'
ORDER BY column_name;