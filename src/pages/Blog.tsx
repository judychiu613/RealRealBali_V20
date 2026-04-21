import { useState, useEffect, useMemo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { BlogCard } from '@/components/BlogCard';
import { BlogPost, BLOG_CATEGORIES, BlogCategory } from '@/lib/index';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';

export default function Blog() {
  const { language } = useApp();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 设置页面标题
  useEffect(() => {
    document.title = language === 'zh' 
      ? '博客 - REAL REAL'
      : 'Blog - REAL REAL';
  }, [language]);

  // 获取文章列表
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log('开始获取文章...');
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        console.log('获取文章结果:', { data, error, count: data?.length });

        if (error) {
          console.error('获取文章失败:', error);
          return;
        }

        setPosts(data || []);
      } catch (error) {
        console.error('获取文章失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 筛选文章
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return posts;
    }
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <>
      <SEOHead
        title={language === 'zh' ? '博客 - REAL REAL' : 'Blog - REAL REAL'}
        description={language === 'zh'
          ? '阅读巴厘岛房产投资指南、市场分析和专业建议'
          : 'Read Bali property investment guides, market analysis and professional advice'}
      />
    <div className="min-h-screen bg-background pt-20">
      {/* 顶部文案区 */}
      <section className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          {language === 'zh' ? '你好！很高兴认识你。' : 'Hello! Nice to meet you.'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          {language === 'zh' 
            ? '希望通过这个频道为您分享关于这个有趣、复杂小岛的一切。'
            : 'We hope to share everything about this interesting and complex island through this channel.'}
        </motion.p>
      </section>

      {/* 栏目筛选 */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap gap-1 justify-center items-center">
          <button
            className={`cursor-pointer px-3 py-1 text-sm transition-all ${
              selectedCategory === 'all'
                ? 'text-primary font-semibold underline decoration-2 underline-offset-4'
                : 'text-muted-foreground hover:text-foreground hover:underline hover:decoration-2 hover:underline-offset-4'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            {language === 'zh' ? '全部' : 'All'}
          </button>
          {BLOG_CATEGORIES.map((category, index) => (
            <>
              <span className="text-muted-foreground/30">|</span>
              <button
                key={category}
                className={`cursor-pointer px-3 py-1 text-sm transition-all ${
                  selectedCategory === category
                    ? 'text-primary font-semibold underline decoration-2 underline-offset-4'
                    : 'text-muted-foreground hover:text-foreground hover:underline hover:decoration-2 hover:underline-offset-4'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            </>
          ))}
        </div>
      </section>

      {/* 文章列表 */}
      <section className="container mx-auto px-4 pb-24">
        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {language === 'zh' ? '加载中...' : 'Loading...'}
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {language === 'zh' ? '暂无文章' : 'No articles yet'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              总文章数: {posts.length}, 筛选后: {filteredPosts.length}, 选中分类: {selectedCategory}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => {
                console.log('渲染文章:', post.title, post);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                );
              })}
            </div>
        )}
      </section>
    </div>
    </>
  );
}