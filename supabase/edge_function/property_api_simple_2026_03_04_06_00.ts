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

    // 简化的区域映射
    const getAreaNames = (areaId: string) => {
      const areaMap: Record<string, { en: string; zh: string }> = {
        'ubud': { en: 'Ubud', zh: '乌布' },
        'canggu': { en: 'Canggu', zh: '仓古' },
        'seminyak': { en: 'Seminyak', zh: '塞米亚克' },
        'sanur': { en: 'Sanur', zh: '萨努尔' },
        'denpasar': { en: 'Denpasar', zh: '登巴萨' },
        'jimbaran': { en: 'Jimbaran', zh: '金巴兰' },
        'nusa_dua': { en: 'Nusa Dua', zh: '努沙杜瓦' },
        'uluwatu': { en: 'Uluwatu', zh: '乌鲁瓦图' },
        'kuta': { en: 'Kuta', zh: '库塔' },
        'legian': { en: 'Legian', zh: '雷吉安' }
      };
      
      return areaMap[areaId] || { en: areaId || 'Unknown', zh: areaId || '未知' };
    };

    // 简化的类型映射
    const getTypeNames = (typeId: string) => {
      switch (typeId) {
        case 'villa':
          return { en: 'Villa', zh: '别墅' };
        case 'land':
          return { en: 'Land', zh: '土地' };
        default:
          return { en: 'Property', zh: '房产' };
      }
    };

    // 处理单个房源数据的函数
    const processProperty = (property: any) => {
      const typeNames = getTypeNames(property.type_id);
      const areaNames = getAreaNames(property.area_id);

      return {
        id: property.id,
        title: {
          zh: property.title_zh || '未命名房产',
          en: property.title_en || 'Untitled Property'
        },
        location: {
          zh: areaNames.zh,
          en: areaNames.en
        },
        type: {
          zh: typeNames.zh,
          en: typeNames.en
        },
        type_id: property.type_id,
        area_id: property.area_id,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        status: property.status || 'available',
        leaseholdYears: property.leasehold_years,
        buildYear: property.build_year,
        price: property.price_usd,
        priceUSD: property.price_usd,
        priceCNY: property.price_cny,
        priceIDR: property.price_idr,
        buildingArea: property.building_area,
        landArea: property.land_area,
        image: property.image || '/placeholder-property.jpg',
        images: property.images ? (Array.isArray(property.images) ? property.images : [property.images]) : [property.image || '/placeholder-property.jpg'],
        featured: property.is_featured || false,
        tags: property.tags || []
      };
    };

    switch (endpoint) {
      case 'properties': {
        const limit = parseInt(url.searchParams.get('limit') || '50');
        
        // 最简单的查询 - 不加任何过滤条件
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        const processedProperties = (properties || []).map(processProperty);

        return new Response(
          JSON.stringify({ 
            data: processedProperties,
            count: processedProperties.length,
            debug: {
              raw_count: properties?.length || 0,
              endpoint: 'properties',
              timestamp: new Date().toISOString()
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'featured': {
        // 获取特色房源 - 简化查询
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        const processedProperties = (properties || []).map(processProperty);

        return new Response(
          JSON.stringify({ 
            data: processedProperties,
            count: processedProperties.length,
            debug: {
              raw_count: properties?.length || 0,
              endpoint: 'featured',
              timestamp: new Date().toISOString()
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'property': {
        const propertyId = url.searchParams.get('id');
        if (!propertyId) {
          return new Response(
            JSON.stringify({ error: 'Property ID is required' }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          );
        }

        const { data: property, error } = await supabaseClient
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single();

        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ error: 'Property not found', details: error.message }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 404 
            }
          );
        }

        const processedProperty = processProperty(property);

        return new Response(
          JSON.stringify({ 
            data: processedProperty,
            debug: {
              endpoint: 'property',
              property_id: propertyId,
              timestamp: new Date().toISOString()
            }
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ 
            error: 'Endpoint not found',
            available_endpoints: ['properties', 'featured', 'property'],
            requested_endpoint: endpoint
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404 
          }
        );
    }

  } catch (error) {
    console.error('Error in property API:', error);
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