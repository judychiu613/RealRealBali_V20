-- 创建 blog_posts 表
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 页面展示（给用户看）
  title TEXT NOT NULL,
  
  -- SEO（给搜索引擎 & AI）
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  
  -- 内容
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  
  -- 分类
  category TEXT NOT NULL,
  
  -- 媒体
  cover_image TEXT,
  
  -- 时间
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 状态
  published BOOLEAN DEFAULT false
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- RLS 策略
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 公开访问已发布的文章
CREATE POLICY "公开访问已发布文章" ON blog_posts
  FOR SELECT
  USING (published = true);

-- 管理员可以进行所有操作
CREATE POLICY "管理员完全访问" ON blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 添加更新时间触发器
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();
