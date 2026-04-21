-- 查看第2篇文章的内容
SELECT id, title, slug, 
       substring(content, 1, 500) as content_preview
FROM blog_posts 
WHERE slug = 'bali-property-investment-roi'
LIMIT 1;