import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const language = url.searchParams.get('language') || 'zh';

    // 获取所有区域数据
    const { data: areas, error } = await supabase
      .from('property_areas_map')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching areas:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 构建层级结构
    const parentAreas = areas?.filter(area => !area.parent_id) || [];
    const childAreas = areas?.filter(area => area.parent_id) || [];

    const hierarchicalAreas = parentAreas.map(parent => ({
      id: parent.area_id,
      label: {
        zh: parent.name_zh,
        en: parent.name_en
      },
      children: childAreas
        .filter(child => child.parent_id === parent.area_id)
        .map(child => ({
          id: child.area_id,
          label: {
            zh: child.name_zh,
            en: child.name_en
          }
        }))
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: hierarchicalAreas,
        total: hierarchicalAreas.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});