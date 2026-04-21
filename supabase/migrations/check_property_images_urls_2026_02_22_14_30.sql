-- 检查房产图片URL格式和可访问性

-- 查看所有房产图片的URL格式
SELECT 
    pi.property_id,
    p.title_zh,
    pi.image_url,
    pi.sort_order,
    LENGTH(pi.image_url) as url_length,
    CASE 
        WHEN pi.image_url LIKE 'http%' THEN 'External URL'
        WHEN pi.image_url LIKE '/images/%' THEN 'Relative Path'
        WHEN pi.image_url LIKE 'images/%' THEN 'Relative Path (no slash)'
        ELSE 'Unknown Format'
    END as url_type
FROM public.property_images pi
JOIN public.properties p ON pi.property_id = p.id
ORDER BY pi.property_id, pi.sort_order
LIMIT 20;

-- 检查是否有空的或无效的图片URL
SELECT 
    COUNT(*) as total_images,
    COUNT(CASE WHEN image_url IS NULL OR image_url = '' THEN 1 END) as empty_urls,
    COUNT(CASE WHEN image_url LIKE 'http%' THEN 1 END) as external_urls,
    COUNT(CASE WHEN image_url LIKE '/images/%' THEN 1 END) as relative_urls
FROM public.property_images;

-- 查看每个房产的图片数量
SELECT 
    p.id,
    p.title_zh,
    p.type_id,
    COUNT(pi.image_url) as image_count,
    STRING_AGG(pi.image_url, ', ' ORDER BY pi.sort_order) as all_images
FROM public.properties p
LEFT JOIN public.property_images pi ON p.id = pi.property_id
WHERE p.is_published = true
GROUP BY p.id, p.title_zh, p.type_id
ORDER BY p.type_id, p.title_zh;