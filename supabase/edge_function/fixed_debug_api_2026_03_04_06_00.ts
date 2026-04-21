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
          supabase_url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET',
          supabase_key: supabaseKey ? `${supabaseKey.substring(0, 30)}...` : 'NOT SET',
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
        // 直接尝试查询properties表来检查是否存在
        try {
          const { data: propertiesTest, error: propError } = await supabaseClient
            .from('properties')
            .select('id')
            .limit(1);

          const { data: imagesTest, error: imgError } = await supabaseClient
            .from('property_images')
            .select('property_id')
            .limit(1);

          return new Response(
            JSON.stringify({ 
              message: 'Tables existence check',
              properties_table: {
                exists: !propError,
                error: propError?.message || null,
                sample_data: propertiesTest?.length || 0
              },
              property_images_table: {
                exists: !imgError,
                error: imgError?.message || null,
                sample_data: imagesTest?.length || 0
              },
              timestamp: new Date().toISOString()
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
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
          const { data, error } = await supabaseClient
            .from('properties')
            .select('id, title_zh, title_en')
            .limit(3);

          return new Response(
            JSON.stringify({ 
              message: 'Simple query test',
              success: !error,
              error: error?.message || null,
              error_code: error?.code || null,
              error_details: error?.details || null,
              error_hint: error?.hint || null,
              data: data,
              data_count: data?.length || 0,
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
            .select('id, title_zh, is_published, status')
            .limit(5);

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

      case 'insert_test': {
        // 测试插入数据（如果没有数据的话）
        try {
          // 先检查是否有数据
          const { count } = await supabaseClient
            .from('properties')
            .select('*', { count: 'exact', head: true });

          if (count === 0) {
            // 如果没有数据，尝试插入一条测试数据
            const { data, error } = await supabaseClient
              .from('properties')
              .insert({
                id: 'debug-test-001',
                title_zh: '调试测试房源',
                title_en: 'Debug Test Property',
                type_id: 'villa',
                area_id: 'seminyak',
                price_usd: 500000,
                is_published: true,
                is_featured: true,
                status: 'available'
              })
              .select();

            return new Response(
              JSON.stringify({ 
                message: 'Insert test',
                success: !error,
                error: error?.message || null,
                data: data,
                note: 'Inserted test data because table was empty',
                timestamp: new Date().toISOString()
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: error ? 500 : 200 
              }
            );
          } else {
            return new Response(
              JSON.stringify({ 
                message: 'Insert test skipped',
                note: `Table already has ${count} records`,
                count: count,
                timestamp: new Date().toISOString()
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200 
              }
            );
          }
        } catch (e) {
          return new Response(
            JSON.stringify({ 
              message: 'Insert test failed',
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
            available_tests: ['env', 'tables', 'simple_query', 'count_only', 'rls_test', 'insert_test']
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