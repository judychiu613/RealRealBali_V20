-- 替换失效的房产图片URL为新的有效图片

-- 首先查看当前失效的图片URL
SELECT 'Before replacement' as status, COUNT(*) as count
FROM public.property_images 
WHERE image_url LIKE '%photo-1520637836862-4d197d17c55a%'
   OR image_url LIKE '%photo-1520637736862-4d197d17c55a%'
   OR image_url LIKE '%photo-1600566752734-d1d394c725dc%'
   OR image_url LIKE '%photo-1768000010004-b60bcbaffb81%';

-- 替换失效的图片URL为新的有效图片
-- 替换 photo-1520637836862-4d197d17c55a (失效的别墅图片)
UPDATE public.property_images 
SET image_url = 'https://images.unsplash.com/photo-1627141234469-24711efb373c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzc2NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080'
WHERE image_url LIKE '%photo-1520637836862-4d197d17c55a%';

-- 替换 photo-1520637736862-4d197d17c55a (另一个失效的别墅图片)
UPDATE public.property_images 
SET image_url = 'https://images.unsplash.com/photo-1671621556327-0596aad30b6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw4fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzc2NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080'
WHERE image_url LIKE '%photo-1520637736862-4d197d17c55a%';

-- 替换 photo-1600566752734-d1d394c725dc (失效的房产图片)
UPDATE public.property_images 
SET image_url = 'https://images.unsplash.com/photo-1696237461860-630be53f179c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzc2NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080'
WHERE image_url LIKE '%photo-1600566752734-d1d394c725dc%';

-- 替换 photo-1768000010004-b60bcbaffb81 (失效的泳池图片)
UPDATE public.property_images 
SET image_url = 'https://images.unsplash.com/photo-1756706718604-ef4af3970e33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHw2fHxtb2Rlcm4lMjBob3VzZSUyMGFyY2hpdGVjdHVyZXxlbnwwfDB8fHwxNzcxNzc2NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080'
WHERE image_url LIKE '%photo-1768000010004-b60bcbaffb81%';

-- 添加更多替换图片，确保有足够的多样性
-- 为一些房产添加额外的图片
INSERT INTO public.property_images (property_id, image_url, sort_order)
SELECT DISTINCT 
    p.id,
    'https://images.unsplash.com/photo-1624524799657-465e72edbcda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4Mzc5NTV8MHwxfHNlYXJjaHwxMHx8bW9kZXJuJTIwaG91c2UlMjBhcmNoaXRlY3R1cmV8ZW58MHwwfHx8MTc3MTc3NjUyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM public.property_images pi2 WHERE pi2.property_id = p.id)
FROM public.properties p
WHERE p.type_id = 'villa' 
  AND p.id IN (
    SELECT property_id 
    FROM public.property_images 
    GROUP BY property_id 
    HAVING COUNT(*) < 4
  )
LIMIT 5;

-- 验证替换结果
SELECT 'After replacement' as status, COUNT(*) as count
FROM public.property_images 
WHERE image_url LIKE '%photo-1520637836862-4d197d17c55a%'
   OR image_url LIKE '%photo-1520637736862-4d197d17c55a%'
   OR image_url LIKE '%photo-1600566752734-d1d394c725dc%'
   OR image_url LIKE '%photo-1768000010004-b60bcbaffb81%';

-- 显示每个房产的图片数量
SELECT 
    p.title_zh,
    p.type_id,
    COUNT(pi.image_url) as image_count,
    STRING_AGG(SUBSTRING(pi.image_url, 1, 50), ', ' ORDER BY pi.sort_order) as sample_images
FROM public.properties p
LEFT JOIN public.property_images pi ON p.id = pi.property_id
WHERE p.is_published = true
GROUP BY p.id, p.title_zh, p.type_id
ORDER BY p.type_id, image_count DESC;