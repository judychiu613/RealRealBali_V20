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

    console.log('Direct query API:', { endpoint, language, limit })

    // 直接查询数据库，包含描述字段
    let query = supabaseClient
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
      query = query.eq('is_featured', true)
    }

    query = query
      .eq('status', 'Available')
      .order('created_at', { ascending: false })
      .limit(limit)

    const { data: properties, error } = await query

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Properties with descriptions:', properties?.length || 0)

    // 获取图片
    const propertyIds = properties?.map(p => p.id) || []
    const { data: images } = await supabaseClient
      .from('property_images')
      .select('property_id, image_url, is_main')
      .in('property_id', propertyIds)

    // 格式化数据，保持与原API相同的格式
    const formattedProperties = properties?.map(property => {
      const mainImage = images?.find(img => img.property_id === property.id && img.is_main)
      const propertyImages = images?.filter(img => img.property_id === property.id) || []

      return {
        id: property.id,
        title: {
          zh: property.title_zh || '',
          en: property.title_en || ''
        },
        location: {
          zh: property.location_zh || '',
          en: property.location_en || ''
        },
        // 添加真实的描述字段
        description_zh: property.description_zh,
        description_en: property.description_en,
        type: property.type_id === 'land' ? { zh: '土地', en: 'Land' } : { zh: '别墅', en: 'Villa' },
        type_id: property.type_id || 'villa',
        area_id: property.area_id || '',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        landArea: property.land_area || 0,
        buildingArea: property.building_area || 0,
        buildYear: property.build_year || 2024,
        price: property.price_usd || 0,
        priceUSD: property.price_usd || 0,
        priceCNY: property.price_cny || 0,
        priceIDR: property.price_idr || 0,
        status: property.status || 'Available',
        ownership: property.ownership || 'Freehold',
        leaseholdYears: property.leasehold_years || null,
        featured: property.is_featured || false,
        tags: [], // 保持兼容性
        image: mainImage?.image_url || '',
        images: propertyImages.length > 0 ? propertyImages.map(img => img.image_url) : [mainImage?.image_url || ''].filter(Boolean)
      }
    }) || []

    console.log('Final data count:', formattedProperties.length)
    if (formattedProperties.length > 0) {
      console.log('Sample with descriptions:', {
        id: formattedProperties[0].id,
        has_description_zh: !!formattedProperties[0].description_zh,
        has_description_en: !!formattedProperties[0].description_en
      })
    }

    return new Response(JSON.stringify(formattedProperties), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})