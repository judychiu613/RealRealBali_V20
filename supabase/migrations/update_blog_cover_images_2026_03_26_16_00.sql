-- 更新两篇博客文章的头图
-- 1. 巴厘岛房产税收政策详解
-- 2. 租赁权和永久产权有什么区别

-- 首先检查这两篇文章是否存在
SELECT id, title, slug, cover_image 
FROM blog_posts 
WHERE slug IN ('bali-property-tax-guide-2026', 'leasehold-vs-freehold-bali-property');

-- 更新税收政策文章的头图
UPDATE blog_posts 
SET cover_image = 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200'
WHERE slug = 'bali-property-tax-guide-2026';

-- 更新租赁权与永久产权文章的头图
UPDATE blog_posts 
SET cover_image = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200'
WHERE slug = 'leasehold-vs-freehold-bali-property';

-- 验证更新结果
SELECT id, title, slug, cover_image 
FROM blog_posts 
WHERE slug IN ('bali-property-tax-guide-2026', 'leasehold-vs-freehold-bali-property');