import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'overview';
    const propertyId = url.searchParams.get('property_id');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let result = {};

    switch (action) {
      case 'overview':
        // 总体浏览统计
        const { data: overviewData, error: overviewError } = await supabaseClient
          .rpc('get_view_analytics_overview', {
            start_date: startDate,
            end_date: endDate
          });

        if (overviewError) throw overviewError;
        result = overviewData;
        break;

      case 'property_stats':
        // 房源浏览统计
        const { data: propertyStats, error: propertyError } = await supabaseClient
          .from('user_views')
          .select(`
            property_id,
            count(*) as total_views,
            count(distinct user_id) as unique_users,
            count(distinct session_id) as unique_sessions,
            avg(view_duration) as avg_duration,
            avg(scroll_depth) as avg_scroll_depth,
            max(created_at) as last_viewed
          `)
          .gte('created_at', startDate || '2024-01-01')
          .lte('created_at', endDate || new Date().toISOString())
          .eq(propertyId ? 'property_id' : 'property_id', propertyId || 'property_id')
          .group('property_id')
          .order('total_views', { ascending: false })
          .limit(limit);

        if (propertyError) throw propertyError;
        result = { property_stats: propertyStats };
        break;

      case 'user_behavior':
        // 用户行为分析
        const { data: behaviorData, error: behaviorError } = await supabaseClient
          .from('user_views')
          .select(`
            user_id,
            session_id,
            property_id,
            page_type,
            view_duration,
            scroll_depth,
            created_at,
            user_agent,
            country,
            city
          `)
          .gte('created_at', startDate || '2024-01-01')
          .lte('created_at', endDate || new Date().toISOString())
          .eq(propertyId ? 'property_id' : 'property_id', propertyId || 'property_id')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (behaviorError) throw behaviorError;
        result = { user_behavior: behaviorData };
        break;

      case 'daily_stats':
        // 每日浏览统计
        const { data: dailyStats, error: dailyError } = await supabaseClient
          .from('user_views')
          .select(`
            created_at::date as date,
            count(*) as total_views,
            count(distinct user_id) as unique_users,
            count(distinct session_id) as unique_sessions,
            avg(view_duration) as avg_duration
          `)
          .gte('created_at', startDate || '2024-01-01')
          .lte('created_at', endDate || new Date().toISOString())
          .group('created_at::date')
          .order('date', { ascending: false })
          .limit(limit);

        if (dailyError) throw dailyError;
        result = { daily_stats: dailyStats };
        break;

      case 'popular_properties':
        // 热门房源排行
        const { data: popularProperties, error: popularError } = await supabaseClient
          .from('user_views')
          .select(`
            property_id,
            count(*) as view_count,
            count(distinct user_id) as unique_viewers,
            avg(view_duration) as avg_duration,
            max(created_at) as last_viewed
          `)
          .gte('created_at', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .lte('created_at', endDate || new Date().toISOString())
          .group('property_id')
          .order('view_count', { ascending: false })
          .limit(limit);

        if (popularError) throw popularError;
        result = { popular_properties: popularProperties };
        break;

      case 'user_segments':
        // 用户分群分析
        const { data: registeredUsers, error: regError } = await supabaseClient
          .from('user_views')
          .select('count(*)')
          .not('user_id', 'is', null)
          .gte('created_at', startDate || '2024-01-01')
          .lte('created_at', endDate || new Date().toISOString())
          .single();

        const { data: anonymousUsers, error: anonError } = await supabaseClient
          .from('user_views')
          .select('count(*)')
          .is('user_id', null)
          .gte('created_at', startDate || '2024-01-01')
          .lte('created_at', endDate || new Date().toISOString())
          .single();

        if (regError || anonError) throw regError || anonError;
        
        result = {
          user_segments: {
            registered_users: registeredUsers?.count || 0,
            anonymous_users: anonymousUsers?.count || 0,
            total_views: (registeredUsers?.count || 0) + (anonymousUsers?.count || 0)
          }
        };
        break;

      default:
        throw new Error('Invalid action parameter');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in view analytics:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});