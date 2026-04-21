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

    // 处理房源数据的辅助函数
    const processProperty = async (property: any) => {
      // 获取房源图片
      const propertyImages = await getPropertyImages(property.id);
      const imageUrls = propertyImages.map(img => img.image_url);
      const mainImage = imageUrls[0] || '/images/default-property.jpg';

      // 根据语言选择标签和特色设施
      const tags = language === 'en' ? property.tags_en : property.tags_zh;
      const amenities = language === 'en' ? property.amenities_en : property.amenities_zh;

      return {
        ...property,
        // 多语言标题和描述
        title: {
          en: property.title_en,
          zh: property.title_zh
        },
        description: {
          en: property.description_en,
          zh: property.description_zh
        },
        location: {
          en: property.area_name_en || 'Unknown',
          zh: property.area_name_zh || '未知'
        },
        type: {
          en: property.type_name_en || 'Villa',
          zh: property.type_name_zh || '别墅'
        },
        landZone: property.land_zone_name_en ? {
          en: property.land_zone_name_en,
          zh: property.land_zone_name_zh
        } : null,
        // 标签处理 - 根据语言返回对应标签
        tags: tags || [],
        tagsEn: property.tags_en || [],
        tagsZh: property.tags_zh || [],
        // 特色设施处理 - 根据语言返回对应设施
        amenities: amenities || [],
        amenitiesEn: property.amenities_en || [],
        amenitiesZh: property.amenities_zh || [],
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
        featured: property.is_featured
      };
    };

    // 根据不同的端点处理请求
    switch (endpoint) {
      case 'properties': {
        const limit = parseInt(url.searchParams.get('limit') || '12');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        
        // 使用简化的查询，避免复杂的关系
        const { data: properties, error } = await supabaseClient
          .from('properties_final_2026_02_21_17_30')
          .select(`
            *
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          throw error;
        }

        // 获取相关的区域和类型信息
        const propertyIds = (properties || []).map(p => p.id);
        
        // 获取区域信息
        const { data: areas } = await supabaseClient
          .from('property_areas_final_2026_02_21_17_30')
          .select('id, name_en, name_zh');
        
        // 获取类型信息
        const { data: types } = await supabaseClient
          .from('property_types_final_2026_02_22_09_30')
          .select('id, name_en, name_zh');

        // 获取土地区域信息
        const { data: landZones } = await supabaseClient
          .from('property_land_zones_final_2026_02_21_17_30')
          .select('id, name_en, name_zh');

        const processedProperties = await Promise.all(
          (properties || []).map(async (property) => {
            // 添加区域信息
            const area = areas?.find(a => a.id === property.area_id);
            property.area_name_en = area?.name_en || 'Unknown';
            property.area_name_zh = area?.name_zh || '未知';
            
            // 添加类型信息
            const type = types?.find(t => t.id === property.type_id);
            property.type_name_en = type?.name_en || 'Villa';
            property.type_name_zh = type?.name_zh || '别墅';
            
            // 添加土地区域信息
            const landZone = landZones?.find(lz => lz.id === property.land_zone_id);
            property.land_zone_name_en = landZone?.name_en;
            property.land_zone_name_zh = landZone?.name_zh;
            
            return await processProperty(property);
          })
        );

        return new Response(
          JSON.stringify({ data: processedProperties }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'featured': {
        const limit = parseInt(url.searchParams.get('limit') || '6');
        
        const { data: properties, error } = await supabaseClient
          .from('properties_final_2026_02_21_17_30')
          .select(`*`)
          .eq('is_published', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          throw error;
        }

        // 获取相关的区域和类型信息
        const { data: areas } = await supabaseClient
          .from('property_areas_final_2026_02_21_17_30')
          .select('id, name_en, name_zh');
        
        const { data: types } = await supabaseClient
          .from('property_types_final_2026_02_22_09_30')
          .select('id, name_en, name_zh');

        const { data: landZones } = await supabaseClient
          .from('property_land_zones_final_2026_02_21_17_30')
          .select('id, name_en, name_zh');

        const processedProperties = await Promise.all(
          (properties || []).map(async (property) => {
            // 添加区域信息
            const area = areas?.find(a => a.id === property.area_id);
            property.area_name_en = area?.name_en || 'Unknown';
            property.area_name_zh = area?.name_zh || '未知';
            
            // 添加类型信息
            const type = types?.find(t => t.id === property.type_id);
            property.type_name_en = type?.name_en || 'Villa';
            property.type_name_zh = type?.name_zh || '别墅';
            
            // 添加土地区域信息
            const landZone = landZones?.find(lz => lz.id === property.land_zone_id);
            property.land_zone_name_en = landZone?.name_en;
            property.land_zone_name_zh = landZone?.name_zh;
            
            return await processProperty(property);
          })
        );

        return new Response(
          JSON.stringify({ data: processedProperties }),
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
          .from('properties_final_2026_02_21_17_30')
          .select(`*`)
          .eq('id', propertyId)
          .eq('is_published', true)
          .single();

        if (error) {
          throw error;
        }

        if (!property) {
          return new Response(
            JSON.stringify({ error: 'Property not found' }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 404 
            }
          );
        }

        // 获取相关信息
        const { data: areas } = await supabaseClient
          .from('property_areas_final_2026_02_21_17_30')
          .select('id, name_en, name_zh');
        
        const { data: types } = await supabaseClient
          .from('property_types_final_2026_02_22_09_30')
          .select('id, name_en, name_zh');

        const { data: landZones } = await supabaseClient
          .from('property_land_zones_final_2026_02_21_17_30')
          .select('id, name_en, name_zh');

        // 添加相关信息
        const area = areas?.find(a => a.id === property.area_id);
        property.area_name_en = area?.name_en || 'Unknown';
        property.area_name_zh = area?.name_zh || '未知';
        
        const type = types?.find(t => t.id === property.type_id);
        property.type_name_en = type?.name_en || 'Villa';
        property.type_name_zh = type?.name_zh || '别墅';
        
        const landZone = landZones?.find(lz => lz.id === property.land_zone_id);
        property.land_zone_name_en = landZone?.name_en;
        property.land_zone_name_zh = landZone?.name_zh;

        const processedProperty = await processProperty(property);

        return new Response(
          JSON.stringify({ data: processedProperty }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'types': {
        const { data: types, error } = await supabaseClient
          .from('property_types_final_2026_02_22_09_30')
          .select('*')
          .order('name_en');

        if (error) {
          throw error;
        }

        const processedTypes = (types || []).map(type => ({
          id: type.id,
          en: type.name_en,
          zh: type.name_zh
        }));

        return new Response(
          JSON.stringify({ data: processedTypes }),
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
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});