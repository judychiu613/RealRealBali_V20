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
    
    // 获取语言参数，默认为中文
    const language = url.searchParams.get('language') || 'zh';

    // 获取房源图片的辅助函数
    const getPropertyImages = async (propertyId: string) => {
      const { data: images, error } = await supabaseClient
        .from('property_images')
        .select('image_url, sort_order')
        .eq('property_id', propertyId)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching property images:', error);
        return [];
      }
      
      return images || [];
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
      
      return areaMap[areaId] || { en: areaId, zh: areaId };
    };

    // 处理单个房源数据的函数
    const processProperty = async (property: any) => {
      // 获取房源图片
      const images = await getPropertyImages(property.id);
      const imageUrls = images.map((img: any) => img.image_url);
      const mainImage = imageUrls[0] || property.image || '/placeholder-property.jpg';

      // 获取类型和区域名称
      const typeNames = getTypeNames(property.type_id);
      const areaNames = getAreaNames(property.area_id);

      return {
        id: property.id,
        // 标题字段
        title: {
          zh: property.title_zh || '未命名房产',
          en: property.title_en || 'Untitled Property'
        },
        // 位置字段
        location: {
          zh: areaNames.zh,
          en: areaNames.en
        },
        // 类型字段
        type: {
          zh: typeNames.zh,
          en: typeNames.en
        },
        type_id: property.type_id,
        area_id: property.area_id,
        // 房间信息
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        // 状态
        status: property.status || 'available',
        // 租赁年限
        leaseholdYears: property.leasehold_years,
        buildYear: property.build_year,
        // 价格字段映射
        price: property.price_usd,
        priceUSD: property.price_usd,
        priceCNY: property.price_cny,
        priceIDR: property.price_idr,
        // 面积字段映射
        buildingArea: property.building_area,
        landArea: property.land_area,
        // 图片字段
        image: mainImage,
        images: imageUrls,
        // 特色房源
        featured: property.is_featured,
        // 标签
        tags: property.tags || []
      };
    };

    // 根据不同的端点处理请求
    switch (endpoint) {
      case 'properties': {
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        
        // 直接从properties表查询，添加状态过滤
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('*')
          .eq('is_published', true)
          .in('status', ['available']) // 只返回可用的房源
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        const processedProperties = await Promise.all(
          (properties || []).map(processProperty)
        );

        return new Response(
          JSON.stringify({ 
            data: processedProperties,
            count: processedProperties.length 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'featured': {
        // 获取特色房源
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select('*')
          .eq('is_published', true)
          .eq('is_featured', true)
          .in('status', ['available'])
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        const processedProperties = await Promise.all(
          (properties || []).map(processProperty)
        );

        return new Response(
          JSON.stringify({ 
            data: processedProperties,
            count: processedProperties.length 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'property': {
        // 获取单个房源详情
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
          .eq('is_published', true)
          .single();

        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ error: 'Property not found' }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 404 
            }
          );
        }

        const processedProperty = await processProperty(property);

        return new Response(
          JSON.stringify({ data: processedProperty }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
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
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});