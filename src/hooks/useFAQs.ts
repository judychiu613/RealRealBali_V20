import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FAQCategory {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh?: string;
  description_en?: string;
  sort_order: number;
}

export interface FAQ {
  id: string;
  category_id: string;
  question_zh: string;
  question_en: string;
  answer_zh: string;
  answer_en: string;
  sort_order: number;
  is_featured: boolean;
  tags: string[];
  view_count: number;
  category?: FAQCategory;
}

export const useFAQs = () => {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);

      // 获取分类
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('faq_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (categoriesError) {
        throw categoriesError;
      }

      // 获取FAQ问题，包含分类信息
      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs')
        .select(`
          *,
          category:faq_categories(*)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (faqsError) {
        throw faqsError;
      }

      setCategories(categoriesData || []);
      setFaqs(faqsData || []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  // 增加问题浏览次数
  const incrementViewCount = async (faqId: string) => {
    try {
      await supabase.rpc('increment_faq_view_count', { faq_id: faqId });
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  // 按分类获取FAQ
  const getFAQsByCategory = (categoryId: string) => {
    return faqs.filter(faq => faq.category_id === categoryId);
  };

  // 获取精选FAQ
  const getFeaturedFAQs = () => {
    return faqs.filter(faq => faq.is_featured);
  };

  // 搜索FAQ
  const searchFAQs = (query: string, language: 'zh' | 'en' = 'zh') => {
    if (!query.trim()) return faqs;
    
    const searchTerm = query.toLowerCase();
    return faqs.filter(faq => {
      const question = language === 'zh' ? faq.question_zh : faq.question_en;
      const answer = language === 'zh' ? faq.answer_zh : faq.answer_en;
      const tags = faq.tags || [];
      
      return (
        question.toLowerCase().includes(searchTerm) ||
        answer.toLowerCase().includes(searchTerm) ||
        tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return {
    categories,
    faqs,
    loading,
    error,
    refetch: fetchFAQs,
    incrementViewCount,
    getFAQsByCategory,
    getFeaturedFAQs,
    searchFAQs
  };
};