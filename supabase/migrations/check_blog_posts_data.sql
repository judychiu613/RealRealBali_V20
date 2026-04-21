-- 检查blog_posts表中的数据数量
SELECT COUNT(*) as total_posts FROM blog_posts;

-- 检查已发布的文章数量
SELECT COUNT(*) as published_posts FROM blog_posts WHERE published = true;

-- 查看前3篇文章的基本信息
SELECT id, title, category, published, created_at 
FROM blog_posts 
ORDER BY created_at DESC 
LIMIT 3;

-- 检查RLS策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'blog_posts';