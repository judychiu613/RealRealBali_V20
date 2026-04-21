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

    // 硬编码的区域和类型映射
    const areaMap: Record<string, string> = {
      'seminyak': '塞米亚克',
      'canggu': '仓古',
      'ubud': '乌布',
      'jimbaran': '金巴兰',
      'denpasar': '登巴萨',
      'sanur': '萨努尔'
    };

    const typeMap: Record<string, string> = {
      'villa': '别墅',
      'land': '土地',
      'apartment': '公寓',
      'commercial': '商业地产'
    };

    // 获取房源图片的辅助函数
    const getPropertyImages = async (propertyId: string) => {
      const { data: images } = await supabaseClient
        .from('property_images')
        .select('image_url')
        .eq('property_id', propertyId)
        .order('sort_order', { ascending: true });
      
      return images?.map(img => img.image_url) || [];
    };

    switch (endpoint) {
      case 'properties': {
        // 获取所有房源
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('*')
          .eq('is_published', true)
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        // 为每个房源添加图片和映射名称
        const propertiesWithDetails = await Promise.all(
          (properties || []).map(async (property) => ({
            ...property,
            area_name: areaMap[property.area_id] || property.area_id,
            type_name: typeMap[property.type_id] || property.type_id,
            images: await getPropertyImages(property.id)
          }))
        );

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: propertiesWithDetails,
            count: propertiesWithDetails.length,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'featured': {
        // 获取特色房源
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('*')
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

        // 为每个房源添加图片和映射名称
        const featuredWithDetails = await Promise.all(
          (properties || []).map(async (property) => ({
            ...property,
            area_name: areaMap[property.area_id] || property.area_id,
            type_name: typeMap[property.type_id] || property.type_id,
            images: await getPropertyImages(property.id)
          }))
        );

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: featuredWithDetails,
            count: featuredWithDetails.length,
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'property': {
        // 获取单个房源详情
        const propertyId = url.searchParams.get('id');
        if (!propertyId) {
          return new Response(
            JSON.stringify({ success: false, error: '缺少房源ID参数' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        const { data: property, error } = await supabaseClient
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .eq('is_published', true)
          .eq('approval_status', 'approved')
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        if (!property) {
          return new Response(
            JSON.stringify({ success: false, error: '房源不存在' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
          );
        }

        // 添加图片和映射名称
        const propertyWithDetails = {
          ...property,
          area_name: areaMap[property.area_id] || property.area_id,
          type_name: typeMap[property.type_id] || property.type_id,
          images: await getPropertyImages(property.id)
        };

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: propertyWithDetails,
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
            available_endpoints: ['properties', 'featured', 'property?id=xxx'],
            timestamp: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
    }

  } catch (error) {
    console.error('Error in new property API:', error);
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