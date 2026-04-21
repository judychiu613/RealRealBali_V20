import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { BlogPost, ROUTE_PATHS } from '@/lib/index';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { language } = useApp();
  
  // 调试：检查post数据
  if (!post || !post.slug) {
    console.error('BlogCard: 无效的post数据', post);
    return null;
  }
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === 'zh') {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const blogUrl = ROUTE_PATHS.BLOG_POST(language, post.slug);
  console.log('BlogCard: 生成链接', { title: post.title, slug: post.slug, url: blogUrl });
  return (
    <Link 
      to={blogUrl}
      className="group block bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
      onClick={(e) => {
        console.log('BlogCard: 点击链接', { url: blogUrl, slug: post.slug });
      }}
    >
      {/* 封面图 */}
      {post.cover_image && (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      {/* 内容区 */}
      <div className="p-6 space-y-3">
        {/* 栏目标签 */}
        <Badge variant="secondary" className="rounded-none text-xs">
          {post.category}
        </Badge>
        
        {/* 标题 */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        {/* 摘要 */}
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        {/* 日期 */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <Calendar className="w-3.5 h-3.5" />
          <time dateTime={post.created_at}>
            {formatDate(post.created_at)}
          </time>
        </div>
      </div>
    </Link>
  );
}