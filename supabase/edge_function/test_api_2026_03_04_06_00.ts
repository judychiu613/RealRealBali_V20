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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'test';

    switch (action) {
      case 'test': {
        return new Response(
          JSON.stringify({ 
            message: 'Edge Function is working!',
            timestamp: new Date().toISOString(),
            url: req.url
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'count': {
        // 测试数据库连接
        const { count, error } = await supabaseClient
          .from('properties')
          .select('*', { count: 'exact', head: true });

        if (error) {
          throw error;
        }

        return new Response(
          JSON.stringify({ 
            message: 'Database connection successful',
            total_properties: count,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'sample': {
        // 获取一些示例数据
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('id, title_zh, title_en, type_id, area_id, price_usd, is_published, status')
          .limit(5);

        if (error) {
          throw error;
        }

        return new Response(
          JSON.stringify({ 
            message: 'Sample data retrieved',
            data: properties,
            count: properties?.length || 0,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'published': {
        // 获取已发布的房源
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('id, title_zh, title_en, type_id, area_id, price_usd, is_published, status')
          .eq('is_published', true)
          .limit(10);

        if (error) {
          throw error;
        }

        return new Response(
          JSON.stringify({ 
            message: 'Published properties retrieved',
            data: properties,
            count: properties?.length || 0,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'available': {
        // 获取可用的房源
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('id, title_zh, title_en, type_id, area_id, price_usd, is_published, status')
          .eq('is_published', true)
          .eq('status', 'available')
          .limit(10);

        if (error) {
          throw error;
        }

        return new Response(
          JSON.stringify({ 
            message: 'Available properties retrieved',
            data: properties,
            count: properties?.length || 0,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid action',
            available_actions: ['test', 'count', 'sample', 'published', 'available']
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
    }

  } catch (error) {
    console.error('Error in test API:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});