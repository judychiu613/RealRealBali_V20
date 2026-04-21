import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // 验证用户身份
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 检查用户是否为管理员
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'POST') {
      const requestData = await req.json();
      
      // 验证必填字段
      if (!requestData.id || !requestData.title_zh || !requestData.title_en || !requestData.price_usd || !requestData.area_id) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields: id, title_zh, title_en, price_usd, area_id' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 检查房源ID是否已存在
      const { data: existingProperty } = await supabaseClient
        .from('properties')
        .select('id')
        .eq('id', requestData.id)
        .single();

      if (existingProperty) {
        return new Response(JSON.stringify({ 
          error: 'Property ID already exists' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 准备插入数据
      const propertyData = {
        id: requestData.id,
        title_en: requestData.title_en,
        title_zh: requestData.title_zh,
        description_en: requestData.description_en || '',
        description_zh: requestData.description_zh || '',
        price_idr: requestData.price_idr || 0,
        price_usd: requestData.price_usd,
        price_cny: requestData.price_cny || 0,
        bedrooms: requestData.bedrooms || 0,
        bathrooms: requestData.bathrooms || 0,
        building_area: requestData.building_area || 0,
        land_area: requestData.land_area || 0,
        area_id: requestData.area_id,
        type_id: requestData.type_id || 'villa',
        ownership: requestData.ownership || 'freehold',
        latitude: requestData.latitude || 0,
        longitude: requestData.longitude || 0,
        tags_en: requestData.tags_en || '',
        tags_zh: requestData.tags_zh || '',
        amenities_en: requestData.amenities_en || '',
        amenities_zh: requestData.amenities_zh || '',
        is_featured: requestData.is_featured || false,
        build_year: requestData.build_year || new Date().getFullYear(),
        land_zone_id: requestData.land_zone_id || '',
        leasehold_years: requestData.leasehold_years || 0,
        // 系统字段
        status: 'pending',
        is_published: false,
        created_by: user.id,
        updated_by: user.id,
        approval_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 插入房源数据
      const { data: newProperty, error: insertError } = await supabaseClient
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        return new Response(JSON.stringify({ 
          error: 'Failed to create property',
          details: insertError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        property: newProperty,
        message: 'Property created successfully and pending approval'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});