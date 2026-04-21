import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';
import { BlogPost as BlogPostType, ROUTE_PATHS } from '@/lib/index';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useApp();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

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

  // 获取文章详情
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        console.error('BlogPost: slug为空');
        return;
      }

      try {
        setLoading(true);
        console.log('BlogPost: 开始获取文章', { slug });
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        console.log('BlogPost: 获取文章结果', { data, error });

        if (error) {
          console.error('获取文章失败:', error);
          return;
        }

        setPost(data);

        // 获取相关文章（同栏目的其他文章）
        if (data) {
          const { data: related } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('category', data.category)
            .eq('published', true)
            .neq('id', data.id)
            .order('created_at', { ascending: false })
            .limit(3);

          setRelatedPosts(related || []);
        }
      } catch (error) {
        console.error('获取文章失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">
          {language === 'zh' ? '加载中...' : 'Loading...'}
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-20 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">
          {language === 'zh' ? '文章不存在' : 'Article not found'}
        </h1>
        <Link to={ROUTE_PATHS.BLOG(language)}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'zh' ? '返回博客' : 'Back to Blog'}
          </Button>
        </Link>
      </div>
    );
  }

  // Schema.org 结构化数据
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.seo_title,
    "description": post.seo_description,
    "image": post.cover_image,
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Bali Property Agency"
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{post.title} - REAL REAL</title>
        <meta name="description" content={post.seo_description} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.seo_title} />
        <meta property="og:description" content={post.seo_description} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta property="og:type" content="article" />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background pt-20">
        {/* 返回按钮 */}
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Link to={ROUTE_PATHS.BLOG(language)}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'zh' ? '返回博客' : 'Back to Blog'}
            </Button>
          </Link>
        </div>

        {/* 文章头部 */}
        <article className="container mx-auto px-4 pb-24 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* 栏目标签 */}
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>

            {/* 文章标题 */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>

            {/* 发布日期 */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.created_at}>
                {formatDate(post.created_at)}
              </time>
            </div>
          </motion.div>

          {/* 封面图 */}
          {post.cover_image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full aspect-[16/9] object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          )}

          {/* 文章内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MarkdownRenderer content={post.content} />
          </motion.div>

          {/* 相关文章 */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16 pt-8 border-t border-border"
            >
              <h2 className="text-2xl font-bold mb-6">
                {language === 'zh' ? '相关文章' : 'Related Articles'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="space-y-2">
                      {relatedPost.cover_image && (
                        <img
                          src={relatedPost.cover_image}
                          alt={relatedPost.title}
                          className="w-full aspect-[16/9] object-cover rounded group-hover:opacity-80 transition-opacity"
                        />
                      )}
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </article>
      </div>
    </>
  );
}