-- 使用新生成的图片更新两篇博客文章的头图
-- 1. 巴厘岛房产税收政策详解 - 使用财务规划图片
-- 2. 租赁权和永久产权有什么区别 - 使用房产钥匙图片

-- 更新税收政策文章的头图（财务规划主题）
UPDATE blog_posts 
SET cover_image = 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDU2OTd8MHwxfHNlYXJjaHw0fHxhY2NvdW50aW5nJTIwbGVkZ2VyJTIwZmluYW5jaWFsJTIwcGxhbm5pbmd8ZW58MHwwfHx8MTc3NDg2NDg0NXww&ixlib=rb-4.1.0&q=80&w=1080'
WHERE slug = 'bali-property-tax-guide-2026';

-- 更新租赁权与永久产权文章的头图（房产钥匙主题）
UPDATE blog_posts 
SET cover_image = 'https://images.unsplash.com/photo-1759428679273-11d914866394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTk0NTh8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwa2V5cyUyMGhvdXNlJTIwb3duZXJzaGlwfGVufDB8MHx8fDE3NzQ4NjQ4NDV8MA&ixlib=rb-4.1.0&q=80&w=1080'
WHERE slug = 'leasehold-vs-freehold-bali-property';

-- 验证更新结果
SELECT id, title, slug, cover_image 
FROM blog_posts 
WHERE slug IN ('bali-property-tax-guide-2026', 'leasehold-vs-freehold-bali-property');