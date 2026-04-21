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

    let query = supabaseClient
      .from('properties')
      .select(`
        id,
        title_zh,
        title_en,
        description_zh,
        description_en,
        location_zh,
        location_en,
        price_usd,
        price_cny,
        price_idr,
        bedrooms,
        bathrooms,
        land_area,
        building_area,
        build_year,
        type_id,
        area_id,
        status,
        ownership,
        leasehold_years,
        is_featured,
        tags_zh,
        tags_en,
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

    // 获取主图片
    const propertyIds = properties?.map(p => p.id) || []
    const { data: images } = await supabaseClient
      .from('property_images')
      .select('property_id, image_url, is_main')
      .in('property_id', propertyIds)

    // 格式化数据
    const formattedProperties = properties?.map(property => {
      const mainImage = images?.find(img => img.property_id === property.id && img.is_main)
      const propertyImages = images?.filter(img => img.property_id === property.id) || []

      return {
        id: property.id,
        title: {
          zh: property.title_zh,
          en: property.title_en
        },
        description: {
          zh: property.description_zh,
          en: property.description_en
        },
        location: {
          zh: property.location_zh,
          en: property.location_en
        },
        price: property.price_usd,
        priceUSD: property.price_usd,
        priceCNY: property.price_cny,
        priceIDR: property.price_idr,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        landArea: property.land_area,
        buildingArea: property.building_area,
        buildYear: property.build_year,
        type: property.type_id === 'land' ? { zh: '土地', en: 'Land' } : { zh: '别墅', en: 'Villa' },
        type_id: property.type_id,
        area_id: property.area_id,
        status: property.status,
        ownership: property.ownership,
        leaseholdYears: property.leasehold_years,
        featured: property.is_featured,
        tags_zh: property.tags_zh || [],
        tags_en: property.tags_en || [],
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