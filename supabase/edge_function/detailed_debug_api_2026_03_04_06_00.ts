import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const test = url.searchParams.get('test') || 'env';

    // 检查环境变量
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (test === 'env') {
      return new Response(
        JSON.stringify({ 
          message: 'Environment variables check',
          supabase_url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'NOT SET',
          supabase_key: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET',
          url_length: supabaseUrl?.length || 0,
          key_length: supabaseKey?.length || 0,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing environment variables',
          supabase_url_set: !!supabaseUrl,
          supabase_key_set: !!supabaseKey
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    switch (test) {
      case 'tables': {
        // 检查表是否存在
        try {
          const { data: tables, error } = await supabaseClient
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['properties', 'property_images']);

          return new Response(
            JSON.stringify({ 
              message: 'Tables check',
              success: !error,
              error: error?.message || null,
              error_details: error?.details || null,
              error_hint: error?.hint || null,
              tables: tables,
              timestamp: new Date().toISOString()
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: error ? 500 : 200 
            }
          );
        } catch (e) {
          return new Response(
            JSON.stringify({ 
              message: 'Tables check failed',
              error: e.message,
              stack: e.stack,
              timestamp: new Date().toISOString()
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500 
            }
          );
        }
      }

      case 'simple_query': {
        // 最简单的查询
        try {
          const { data, error, count } = await supabaseClient
            .from('properties')
            .select('id', { count: 'exact' })
            .limit(1);

          return new Response(
            JSON.stringify({ 
              message: 'Simple query test',
              success: !error,
              error: error?.message || null,
              error_code: error?.code || null,
              error_details: error?.details || null,
              error_hint: error?.hint || null,
              data: data,
              count: count,
              timestamp: new Date().toISOString()
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: error ? 500 : 200 
            }
          );
        } catch (e) {
          return new Response(
            JSON.stringify({ 
              message: 'Simple query failed',
              error: e.message,
              stack: e.stack,
              timestamp: new Date().toISOString()
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500 
            }
          );
        }
      }

      case 'count_only': {
        // 只获取计数
        try {
          const { count, error } = await supabaseClient
            .from('properties')
            .select('*', { count: 'exact', head: true });

          return new Response(
            JSON.stringify({ 
              message: 'Count only test',
              success: !error,
              error: error?.message || null,
              error_code: error?.code || null,
              error_details: error?.details || null,
              count: count,
              timestamp: new Date().toISOString()
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: error ? 500 : 200 
            }
          );
        } catch (e) {
          return new Response(
            JSON.stringify({ 
              message: 'Count only failed',
              error: e.message,
              stack: e.stack,
              timestamp: new Date().toISOString()
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500 
            }
          );
        }
      }

      case 'rls_test': {
        // 测试RLS策略
        try {
          const { data, error } = await supabaseClient
            .from('properties')
            .select('id, title_zh')
            .limit(1);

          return new Response(
            JSON.stringify({ 
              message: 'RLS test',
              success: !error,
              error: error?.message || null,
              error_code: error?.code || null,
              data: data,
              data_length: data?.length || 0,
              timestamp: new Date().toISOString()
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: error ? 500 : 200 
            }
          );
        } catch (e) {
          return new Response(
            JSON.stringify({ 
              message: 'RLS test failed',
              error: e.message,
              stack: e.stack,
              timestamp: new Date().toISOString()
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500 
            }
          );
        }
      }

      default: {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid test parameter',
            available_tests: ['env', 'tables', 'simple_query', 'count_only', 'rls_test']
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
    }

  } catch (error) {
    console.error('Error in detailed debug API:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});