-- 创建FAQ浏览次数增加函数
-- 日期: 2026-02-22 21:20

-- 创建增加FAQ浏览次数的函数
CREATE OR REPLACE FUNCTION increment_faq_view_count(faq_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.faqs 
  SET view_count = view_count + 1,
      updated_at = NOW()
  WHERE id = faq_id AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建获取热门FAQ的函数
CREATE OR REPLACE FUNCTION get_popular_faqs(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  question_zh TEXT,
  question_en TEXT,
  answer_zh TEXT,
  answer_en TEXT,
  view_count INTEGER,
  category_name_zh TEXT,
  category_name_en TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.question_zh,
    f.question_en,
    f.answer_zh,
    f.answer_en,
    f.view_count,
    c.name_zh as category_name_zh,
    c.name_en as category_name_en
  FROM public.faqs f
  JOIN public.faq_categories c ON f.category_id = c.id
  WHERE f.is_active = true AND c.is_active = true
  ORDER BY f.view_count DESC, f.sort_order ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建搜索FAQ的函数
CREATE OR REPLACE FUNCTION search_faqs(
  search_term TEXT,
  language_code TEXT DEFAULT 'zh'
)
RETURNS TABLE (
  id UUID,
  question_zh TEXT,
  question_en TEXT,
  answer_zh TEXT,
  answer_en TEXT,
  category_name_zh TEXT,
  category_name_en TEXT,
  tags TEXT[],
  relevance_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.question_zh,
    f.question_en,
    f.answer_zh,
    f.answer_en,
    c.name_zh as category_name_zh,
    c.name_en as category_name_en,
    f.tags,
    CASE 
      WHEN language_code = 'zh' THEN
        (CASE WHEN f.question_zh ILIKE '%' || search_term || '%' THEN 3 ELSE 0 END) +
        (CASE WHEN f.answer_zh ILIKE '%' || search_term || '%' THEN 2 ELSE 0 END) +
        (CASE WHEN array_to_string(f.tags, ' ') ILIKE '%' || search_term || '%' THEN 1 ELSE 0 END)
      ELSE
        (CASE WHEN f.question_en ILIKE '%' || search_term || '%' THEN 3 ELSE 0 END) +
        (CASE WHEN f.answer_en ILIKE '%' || search_term || '%' THEN 2 ELSE 0 END) +
        (CASE WHEN array_to_string(f.tags, ' ') ILIKE '%' || search_term || '%' THEN 1 ELSE 0 END)
    END as relevance_score
  FROM public.faqs f
  JOIN public.faq_categories c ON f.category_id = c.id
  WHERE f.is_active = true AND c.is_active = true
  AND (
    (language_code = 'zh' AND (
      f.question_zh ILIKE '%' || search_term || '%' OR
      f.answer_zh ILIKE '%' || search_term || '%' OR
      array_to_string(f.tags, ' ') ILIKE '%' || search_term || '%'
    )) OR
    (language_code = 'en' AND (
      f.question_en ILIKE '%' || search_term || '%' OR
      f.answer_en ILIKE '%' || search_term || '%' OR
      array_to_string(f.tags, ' ') ILIKE '%' || search_term || '%'
    ))
  )
  ORDER BY relevance_score DESC, f.sort_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 测试函数
SELECT 
  '函数测试' as category,
  '✅ increment_faq_view_count 函数已创建' as increment_function,
  '✅ get_popular_faqs 函数已创建' as popular_function,
  '✅ search_faqs 函数已创建' as search_function;