-- 创建浏览统计概览函数
CREATE OR REPLACE FUNCTION get_view_analytics_overview(
  start_date TEXT DEFAULT NULL,
  end_date TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  start_ts TIMESTAMP WITH TIME ZONE;
  end_ts TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 设置默认时间范围（最近30天）
  start_ts := COALESCE(start_date::TIMESTAMP WITH TIME ZONE, NOW() - INTERVAL '30 days');
  end_ts := COALESCE(end_date::TIMESTAMP WITH TIME ZONE, NOW());
  
  SELECT json_build_object(
    'total_views', (
      SELECT COUNT(*) FROM public.user_views 
      WHERE created_at BETWEEN start_ts AND end_ts
    ),
    'unique_users', (
      SELECT COUNT(DISTINCT user_id) FROM public.user_views 
      WHERE created_at BETWEEN start_ts AND end_ts AND user_id IS NOT NULL
    ),
    'unique_sessions', (
      SELECT COUNT(DISTINCT session_id) FROM public.user_views 
      WHERE created_at BETWEEN start_ts AND end_ts
    ),
    'anonymous_views', (
      SELECT COUNT(*) FROM public.user_views 
      WHERE created_at BETWEEN start_ts AND end_ts AND user_id IS NULL
    ),
    'registered_views', (
      SELECT COUNT(*) FROM public.user_views 
      WHERE created_at BETWEEN start_ts AND end_ts AND user_id IS NOT NULL
    ),
    'avg_view_duration', (
      SELECT ROUND(AVG(view_duration), 2) FROM public.user_views 
      WHERE created_at BETWEEN start_ts AND end_ts AND view_duration > 0
    ),
    'avg_scroll_depth', (
      SELECT ROUND(AVG(scroll_depth), 2) FROM public.user_views 
      WHERE created_at BETWEEN start_ts AND end_ts AND scroll_depth > 0
    ),
    'page_type_breakdown', (
      SELECT json_object_agg(page_type, view_count)
      FROM (
        SELECT page_type, COUNT(*) as view_count
        FROM public.user_views 
        WHERE created_at BETWEEN start_ts AND end_ts
        GROUP BY page_type
      ) breakdown
    ),
    'top_properties', (
      SELECT json_agg(
        json_build_object(
          'property_id', property_id,
          'view_count', view_count,
          'unique_viewers', unique_viewers
        )
      )
      FROM (
        SELECT 
          property_id,
          COUNT(*) as view_count,
          COUNT(DISTINCT COALESCE(user_id::TEXT, session_id)) as unique_viewers
        FROM public.user_views 
        WHERE created_at BETWEEN start_ts AND end_ts
        GROUP BY property_id
        ORDER BY view_count DESC
        LIMIT 10
      ) top_props
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建房源浏览详情函数
CREATE OR REPLACE FUNCTION get_property_view_details(
  target_property_id TEXT,
  start_date TEXT DEFAULT NULL,
  end_date TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  start_ts TIMESTAMP WITH TIME ZONE;
  end_ts TIMESTAMP WITH TIME ZONE;
BEGIN
  start_ts := COALESCE(start_date::TIMESTAMP WITH TIME ZONE, NOW() - INTERVAL '30 days');
  end_ts := COALESCE(end_date::TIMESTAMP WITH TIME ZONE, NOW());
  
  SELECT json_build_object(
    'property_id', target_property_id,
    'total_views', (
      SELECT COUNT(*) FROM public.user_views 
      WHERE property_id = target_property_id 
      AND created_at BETWEEN start_ts AND end_ts
    ),
    'unique_viewers', (
      SELECT COUNT(DISTINCT COALESCE(user_id::TEXT, session_id))
      FROM public.user_views 
      WHERE property_id = target_property_id 
      AND created_at BETWEEN start_ts AND end_ts
    ),
    'avg_view_duration', (
      SELECT ROUND(AVG(view_duration), 2) FROM public.user_views 
      WHERE property_id = target_property_id 
      AND created_at BETWEEN start_ts AND end_ts 
      AND view_duration > 0
    ),
    'avg_scroll_depth', (
      SELECT ROUND(AVG(scroll_depth), 2) FROM public.user_views 
      WHERE property_id = target_property_id 
      AND created_at BETWEEN start_ts AND end_ts 
      AND scroll_depth > 0
    ),
    'daily_views', (
      SELECT json_agg(
        json_build_object(
          'date', view_date,
          'views', daily_count
        ) ORDER BY view_date
      )
      FROM (
        SELECT 
          created_at::DATE as view_date,
          COUNT(*) as daily_count
        FROM public.user_views 
        WHERE property_id = target_property_id 
        AND created_at BETWEEN start_ts AND end_ts
        GROUP BY created_at::DATE
        ORDER BY view_date
      ) daily_data
    ),
    'user_type_breakdown', (
      SELECT json_build_object(
        'registered', COUNT(*) FILTER (WHERE user_id IS NOT NULL),
        'anonymous', COUNT(*) FILTER (WHERE user_id IS NULL)
      )
      FROM public.user_views 
      WHERE property_id = target_property_id 
      AND created_at BETWEEN start_ts AND end_ts
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建用户浏览历史函数
CREATE OR REPLACE FUNCTION get_user_view_history(
  target_user_id UUID DEFAULT NULL,
  target_session_id TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  property_id TEXT,
  page_type TEXT,
  view_duration INTEGER,
  scroll_depth DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE,
  user_agent TEXT,
  referrer TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uv.property_id,
    uv.page_type,
    uv.view_duration,
    uv.scroll_depth,
    uv.created_at,
    uv.user_agent,
    uv.referrer
  FROM public.user_views uv
  WHERE 
    (target_user_id IS NULL OR uv.user_id = target_user_id) AND
    (target_session_id IS NULL OR uv.session_id = target_session_id)
  ORDER BY uv.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 测试函数
SELECT get_view_analytics_overview();

-- 创建视图：热门房源统计
CREATE OR REPLACE VIEW popular_properties_view AS
SELECT 
  property_id,
  COUNT(*) as total_views,
  COUNT(DISTINCT COALESCE(user_id::TEXT, session_id)) as unique_viewers,
  ROUND(AVG(view_duration), 2) as avg_duration,
  ROUND(AVG(scroll_depth), 2) as avg_scroll_depth,
  MAX(created_at) as last_viewed,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as views_last_7_days,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as views_last_30_days
FROM public.user_views
GROUP BY property_id
ORDER BY total_views DESC;

-- 创建视图：用户活跃度统计
CREATE OR REPLACE VIEW user_activity_view AS
SELECT 
  COALESCE(user_id::TEXT, session_id) as identifier,
  CASE WHEN user_id IS NOT NULL THEN 'registered' ELSE 'anonymous' END as user_type,
  COUNT(*) as total_views,
  COUNT(DISTINCT property_id) as properties_viewed,
  ROUND(AVG(view_duration), 2) as avg_duration,
  ROUND(AVG(scroll_depth), 2) as avg_scroll_depth,
  MIN(created_at) as first_visit,
  MAX(created_at) as last_visit
FROM public.user_views
GROUP BY COALESCE(user_id::TEXT, session_id), user_id
ORDER BY total_views DESC;