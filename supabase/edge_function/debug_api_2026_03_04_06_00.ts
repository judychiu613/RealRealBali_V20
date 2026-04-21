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
    const test = url.searchParams.get('test') || 'basic';

    switch (test) {
      case 'basic': {
        return new Response(
          JSON.stringify({ 
            message: 'Edge Function is working!',
            timestamp: new Date().toISOString(),
            supabase_url: Deno.env.get('SUPABASE_URL') ? 'Set' : 'Not set',
            supabase_key: Deno.env.get('SUPABASE_ANON_KEY') ? 'Set' : 'Not set'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'db_connection': {
        // 测试数据库连接
        const { count, error } = await supabaseClient
          .from('properties')
          .select('*', { count: 'exact', head: true });

        return new Response(
          JSON.stringify({ 
            message: 'Database connection test',
            success: !error,
            error: error?.message || null,
            properties_count: count,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: error ? 500 : 200 
          }
        );
      }

      case 'raw_data': {
        // 获取原始数据
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('id, title_zh, title_en, type_id, area_id, price_usd, is_published, is_featured, status')
          .limit(3);

        return new Response(
          JSON.stringify({ 
            message: 'Raw data test',
            success: !error,
            error: error?.message || null,
            data: properties,
            count: properties?.length || 0,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: error ? 500 : 200 
          }
        );
      }

      case 'images': {
        // 测试图片数据
        const { data: images, error } = await supabaseClient
          .from('property_images')
          .select('property_id, image_url, sort_order')
          .limit(5);

        return new Response(
          JSON.stringify({ 
            message: 'Images data test',
            success: !error,
            error: error?.message || null,
            data: images,
            count: images?.length || 0,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: error ? 500 : 200 
          }
        );
      }

      case 'featured': {
        // 测试特色房源查询
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('id, title_zh, title_en, is_featured')
          .eq('is_featured', true)
          .limit(5);

        return new Response(
          JSON.stringify({ 
            message: 'Featured properties test',
            success: !error,
            error: error?.message || null,
            data: properties,
            count: properties?.length || 0,
            timestamp: new Date().toISOString()
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: error ? 500 : 200 
          }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid test parameter',
            available_tests: ['basic', 'db_connection', 'raw_data', 'images', 'featured']
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
    }

  } catch (error) {
    console.error('Error in debug API:', error);
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