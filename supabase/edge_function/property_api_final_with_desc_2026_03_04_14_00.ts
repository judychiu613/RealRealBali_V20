// 基于原API property_api_complete_2026_03_04_06_00 的代码，只添加description字段
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const url = new URL(req.url)
    const endpoint = url.pathname.split('/').pop()
    const language = url.searchParams.get('language') || 'zh'
    const limit = parseInt(url.searchParams.get('limit') || '20')

    // 获取房源数据 - 添加description字段
    let propertiesQuery = supabaseClient
      .from('properties')
      .select(`
        id,
        title_zh,
        title_en,
        location_zh,
        location_en,
        description_zh,
        description_en,
        type_id,
        area_id,
        bedrooms,
        bathrooms,
        land_area,
        building_area,
        build_year,
        price_usd,
        price_cny,
        price_idr,
        status,
        ownership,
        leasehold_years,
        is_featured,
        created_at,
        updated_at
      `)

    if (endpoint === 'featured') {
      propertiesQuery = propertiesQuery.eq('is_featured', true)
    }

    const { data: properties, error: propertiesError } = await propertiesQuery
      .eq('status', 'Available')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (propertiesError) {
      return new Response(JSON.stringify({ error: propertiesError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 获取图片数据
    const propertyIds = properties?.map(p => p.id) || []
    const { data: images } = await supabaseClient
      .from('property_images')
      .select('property_id, image_url, is_main')
      .in('property_id', propertyIds)

    // 获取标签数据
    const { data: tags } = await supabaseClient
      .from('property_tags')
      .select('property_id, tag_name')
      .in('property_id', propertyIds)

    // 格式化数据 - 完全按照原API的格式
    const formattedProperties = properties?.map(property => {
      const mainImage = images?.find(img => img.property_id === property.id && img.is_main)
      const propertyImages = images?.filter(img => img.property_id === property.id) || []
      const propertyTags = tags?.filter(tag => tag.property_id === property.id).map(tag => tag.tag_name) || []

      return {
        id: property.id,
        title: {
          zh: property.title_zh,
          en: property.title_en
        },
        location: {
          zh: property.location_zh,
          en: property.location_en
        },
        // 添加真实的描述字段
        description_zh: property.description_zh,
        description_en: property.description_en,
        type: property.type_id === 'land' ? { zh: '土地', en: 'Land' } : { zh: '别墅', en: 'Villa' },
        type_id: property.type_id,
        area_id: property.area_id,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        landArea: property.land_area,
        buildingArea: property.building_area,
        buildYear: property.build_year,
        price: property.price_usd,
        priceUSD: property.price_usd,
        priceCNY: property.price_cny,
        priceIDR: property.price_idr,
        status: property.status,
        ownership: property.ownership,
        leaseholdYears: property.leasehold_years,
        featured: property.is_featured,
        tags: propertyTags,
        image: mainImage?.image_url || '',
        images: propertyImages.map(img => img.image_url),
        createdAt: property.created_at,
        updatedAt: property.updated_at
      }
    }) || []

    return new Response(JSON.stringify(formattedProperties), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})