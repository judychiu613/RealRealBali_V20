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
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];

    switch (endpoint) {
      case 'properties': {
        // 获取所有房源
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('id, title_zh, title_en, price_usd, price_cny, price_idr, bedrooms, bathrooms, building_area, land_area, type_id, area_id, is_featured')
          .eq('is_published', true)
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: properties || [],
            count: properties?.length || 0,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'featured': {
        // 获取特色房源
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('id, title_zh, title_en, price_usd, price_cny, price_idr, bedrooms, bathrooms, building_area, land_area, type_id, area_id')
          .eq('is_published', true)
          .eq('approval_status', 'approved')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: properties || [],
            count: properties?.length || 0,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: '端点不存在',
            available_endpoints: ['properties', 'featured'],
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
    }

  } catch (error) {
    console.error('Error in simple property API:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器内部错误',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});