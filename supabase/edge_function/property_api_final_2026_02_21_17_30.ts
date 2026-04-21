import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()
    const searchParams = url.searchParams

    switch (path) {
      case 'areas':
        return await getAreas(supabaseClient)
      
      case 'types':
        return await getPropertyTypes(supabaseClient)
      
      case 'properties':
        return await getProperties(supabaseClient, searchParams)
      
      case 'property':
        const propertyId = searchParams.get('id')
        if (!propertyId) {
          return new Response(JSON.stringify({ error: 'Property ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        return await getPropertyById(supabaseClient, propertyId)
      
      case 'featured':
        return await getFeaturedProperties(supabaseClient, searchParams)
      
      case 'similar':
        const basePropertyId = searchParams.get('id')
        if (!basePropertyId) {
          return new Response(JSON.stringify({ error: 'Property ID is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        return await getSimilarProperties(supabaseClient, basePropertyId)
      
      case 'stats':
        return await getPropertyStats(supabaseClient)
      
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function getAreas(supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('property_areas_final_2026_02_21_17_30')
    .select('*')
    .order('level', { ascending: true })
    .order('sort_order', { ascending: true })

  if (error) throw error

  return new Response(JSON.stringify({ data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getPropertyTypes(supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('property_types_final_2026_02_21_17_30')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw error

  return new Response(JSON.stringify({ data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getProperties(supabaseClient: any, searchParams: URLSearchParams) {
  let query = supabaseClient
    .from('properties_final_2026_02_21_17_30')
    .select(`
      *,
      area:property_areas_final_2026_02_21_17_30(id, name_en, name_zh, parent_id, level),
      type:property_types_final_2026_02_21_17_30(name_en, name_zh, slug),
      images:property_images_final_2026_02_21_17_30(image_url, is_primary, sort_order, image_type)
    `)
    .eq('is_published', true)

  // Apply filters
  const areaFilter = searchParams.get('area')
  if (areaFilter) {
    query = query.eq('area_id', areaFilter)
  }

  const typeFilter = searchParams.get('type')
  if (typeFilter) {
    query = query.eq('type.slug', typeFilter)
  }

  const minPrice = searchParams.get('min_price')
  if (minPrice) {
    query = query.gte('price_usd', parseInt(minPrice))
  }

  const maxPrice = searchParams.get('max_price')
  if (maxPrice) {
    query = query.lte('price_usd', parseInt(maxPrice))
  }

  // 新增：房间数量筛选
  const bedrooms = searchParams.get('bedrooms')
  if (bedrooms) {
    query = query.gte('bedrooms', parseInt(bedrooms))
  }

  // 新增：土地面积筛选
  const minLandArea = searchParams.get('min_land_area')
  if (minLandArea) {
    query = query.gte('land_area', parseInt(minLandArea))
  }

  const maxLandArea = searchParams.get('max_land_area')
  if (maxLandArea) {
    query = query.lte('land_area', parseInt(maxLandArea))
  }

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = (page - 1) * limit

  query = query.range(offset, offset + limit - 1)
  query = query.order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) throw error

  // Transform data to match frontend format
  const transformedData = data?.map(property => ({
    id: property.id,
    title: {
      zh: property.title_zh,
      en: property.title_en
    },
    // 多货币价格支持
    price: property.price_usd,
    priceUSD: property.price_usd,
    priceCNY: property.price_cny,
    priceIDR: property.price_idr,
    location: {
      zh: property.area?.name_zh || '',
      en: property.area?.name_en || ''
    },
    type: {
      zh: property.type?.name_zh || '',
      en: property.type?.name_en || ''
    },
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    landArea: property.land_area,
    buildingArea: property.building_area,
    image: property.images?.find(img => img.is_primary)?.image_url || property.images?.[0]?.image_url || '',
    images: property.images?.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url) || [],
    status: property.status === 'available' ? 'Available' : property.status,
    ownership: property.ownership === 'leasehold' ? 'Leasehold' : 'Freehold',
    leaseholdYears: property.ownership === 'leasehold' ? 25 : undefined,
    landZone: 'Yellow Zone',
    description: {
      zh: property.description_zh || '',
      en: property.description_en || ''
    },
    featured: property.is_featured,
    // 双语标签支持
    tags: property.tags_zh || [],
    tagsEn: property.tags_en || [],
    coordinates: {
      lat: property.latitude,
      lng: property.longitude
    }
  }))

  return new Response(JSON.stringify({ 
    data: transformedData,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit)
    }
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getPropertyById(supabaseClient: any, propertyId: string) {
  const { data, error } = await supabaseClient
    .from('properties_final_2026_02_21_17_30')
    .select(`
      *,
      area:property_areas_final_2026_02_21_17_30(id, name_en, name_zh, parent_id, level),
      type:property_types_final_2026_02_21_17_30(name_en, name_zh, slug),
      images:property_images_final_2026_02_21_17_30(image_url, is_primary, sort_order, image_type)
    `)
    .eq('id', propertyId)
    .eq('is_published', true)
    .single()

  if (error) throw error

  // Transform data to match frontend format
  const transformedData = {
    id: data.id,
    title: {
      zh: data.title_zh,
      en: data.title_en
    },
    // 多货币价格支持
    price: data.price_usd,
    priceUSD: data.price_usd,
    priceCNY: data.price_cny,
    priceIDR: data.price_idr,
    location: {
      zh: data.area?.name_zh || '',
      en: data.area?.name_en || ''
    },
    type: {
      zh: data.type?.name_zh || '',
      en: data.type?.name_en || ''
    },
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    landArea: data.land_area,
    buildingArea: data.building_area,
    image: data.images?.find(img => img.is_primary)?.image_url || data.images?.[0]?.image_url || '',
    images: data.images?.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url) || [],
    status: data.status === 'available' ? 'Available' : data.status,
    ownership: data.ownership === 'leasehold' ? 'Leasehold' : 'Freehold',
    leaseholdYears: data.ownership === 'leasehold' ? 25 : undefined,
    landZone: 'Yellow Zone',
    description: {
      zh: data.description_zh || '',
      en: data.description_en || ''
    },
    featured: data.is_featured,
    // 双语标签支持
    tags: data.tags_zh || [],
    tagsEn: data.tags_en || [],
    coordinates: {
      lat: data.latitude,
      lng: data.longitude
    }
  }

  // Record property view
  await recordPropertyView(supabaseClient, data.id)

  return new Response(JSON.stringify({ data: transformedData }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getFeaturedProperties(supabaseClient: any, searchParams: URLSearchParams) {
  let query = supabaseClient
    .from('properties_final_2026_02_21_17_30')
    .select(`
      *,
      area:property_areas_final_2026_02_21_17_30(id, name_en, name_zh, parent_id, level),
      type:property_types_final_2026_02_21_17_30(name_en, name_zh, slug),
      images:property_images_final_2026_02_21_17_30(image_url, is_primary, sort_order, image_type)
    `)
    .eq('is_featured', true)
    .eq('is_published', true)

  // 新增：精选房产也支持筛选
  const bedrooms = searchParams.get('bedrooms')
  if (bedrooms) {
    query = query.gte('bedrooms', parseInt(bedrooms))
  }

  const minLandArea = searchParams.get('min_land_area')
  if (minLandArea) {
    query = query.gte('land_area', parseInt(minLandArea))
  }

  const maxLandArea = searchParams.get('max_land_area')
  if (maxLandArea) {
    query = query.lte('land_area', parseInt(maxLandArea))
  }

  const minPrice = searchParams.get('min_price')
  if (minPrice) {
    query = query.gte('price_usd', parseInt(minPrice))
  }

  const maxPrice = searchParams.get('max_price')
  if (maxPrice) {
    query = query.lte('price_usd', parseInt(maxPrice))
  }

  query = query.order('created_at', { ascending: false })
  query = query.limit(50)

  const { data, error } = await query

  if (error) throw error

  // Transform data to match frontend format
  const transformedData = data?.map(property => ({
    id: property.id,
    title: {
      zh: property.title_zh,
      en: property.title_en
    },
    // 多货币价格支持
    price: property.price_usd,
    priceUSD: property.price_usd,
    priceCNY: property.price_cny,
    priceIDR: property.price_idr,
    location: {
      zh: property.area?.name_zh || '',
      en: property.area?.name_en || ''
    },
    type: {
      zh: property.type?.name_zh || '',
      en: property.type?.name_en || ''
    },
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    landArea: property.land_area,
    buildingArea: property.building_area,
    image: property.images?.find(img => img.is_primary)?.image_url || property.images?.[0]?.image_url || '',
    images: property.images?.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url) || [],
    status: property.status === 'available' ? 'Available' : property.status,
    ownership: property.ownership === 'leasehold' ? 'Leasehold' : 'Freehold',
    leaseholdYears: property.ownership === 'leasehold' ? 25 : undefined,
    landZone: 'Yellow Zone',
    description: {
      zh: property.description_zh || '',
      en: property.description_en || ''
    },
    featured: property.is_featured,
    // 双语标签支持
    tags: property.tags_zh || [],
    tagsEn: property.tags_en || [],
    coordinates: {
      lat: property.latitude,
      lng: property.longitude
    }
  }))

  return new Response(JSON.stringify({ data: transformedData }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getSimilarProperties(supabaseClient: any, propertyId: string) {
  // Get the base property first
  const { data: baseProperty } = await supabaseClient
    .from('properties_final_2026_02_21_17_30')
    .select('type_id, area_id, price_usd')
    .eq('id', propertyId)
    .single()

  if (!baseProperty) {
    return new Response(JSON.stringify({ data: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Find similar properties
  const { data, error } = await supabaseClient
    .from('properties_final_2026_02_21_17_30')
    .select(`
      *,
      area:property_areas_final_2026_02_21_17_30(id, name_en, name_zh, parent_id, level),
      type:property_types_final_2026_02_21_17_30(name_en, name_zh, slug),
      images:property_images_final_2026_02_21_17_30(image_url, is_primary, sort_order, image_type)
    `)
    .neq('id', propertyId)
    .eq('is_published', true)
    .or(`type_id.eq.${baseProperty.type_id},area_id.eq.${baseProperty.area_id}`)
    .limit(4)

  if (error) throw error

  // Transform data to match frontend format
  const transformedData = data?.map(property => ({
    id: property.id,
    title: {
      zh: property.title_zh,
      en: property.title_en
    },
    // 多货币价格支持
    price: property.price_usd,
    priceUSD: property.price_usd,
    priceCNY: property.price_cny,
    priceIDR: property.price_idr,
    location: {
      zh: property.area?.name_zh || '',
      en: property.area?.name_en || ''
    },
    type: {
      zh: property.type?.name_zh || '',
      en: property.type?.name_en || ''
    },
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    landArea: property.land_area,
    buildingArea: property.building_area,
    image: property.images?.find(img => img.is_primary)?.image_url || property.images?.[0]?.image_url || '',
    images: property.images?.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url) || [],
    status: property.status === 'available' ? 'Available' : property.status,
    ownership: property.ownership === 'leasehold' ? 'Leasehold' : 'Freehold',
    leaseholdYears: property.ownership === 'leasehold' ? 25 : undefined,
    landZone: 'Yellow Zone',
    description: {
      zh: property.description_zh || '',
      en: property.description_en || ''
    },
    featured: property.is_featured,
    // 双语标签支持
    tags: property.tags_zh || [],
    tagsEn: property.tags_en || [],
    coordinates: {
      lat: property.latitude,
      lng: property.longitude
    }
  }))

  return new Response(JSON.stringify({ data: transformedData }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function getPropertyStats(supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('properties_final_2026_02_21_17_30')
    .select('price_usd, bedrooms, bathrooms, building_area, land_area')
    .eq('is_published', true)

  if (error) throw error

  const stats = {
    totalProperties: data.length,
    averagePrice: Math.round(data.reduce((sum, p) => sum + p.price_usd, 0) / data.length),
    priceRange: {
      min: Math.min(...data.map(p => p.price_usd)),
      max: Math.max(...data.map(p => p.price_usd))
    },
    averageBedrooms: Math.round(data.reduce((sum, p) => sum + p.bedrooms, 0) / data.length * 10) / 10,
    averageBathrooms: Math.round(data.reduce((sum, p) => sum + p.bathrooms, 0) / data.length * 10) / 10,
    averageBuildingArea: Math.round(data.reduce((sum, p) => sum + p.building_area, 0) / data.length),
    averageLandArea: Math.round(data.reduce((sum, p) => sum + p.land_area, 0) / data.length),
    // 新增：土地面积范围统计
    landAreaRange: {
      min: Math.min(...data.map(p => p.land_area)),
      max: Math.max(...data.map(p => p.land_area))
    },
    // 新增：房间数量分布
    bedroomDistribution: {
      '1-2': data.filter(p => p.bedrooms >= 1 && p.bedrooms <= 2).length,
      '3-4': data.filter(p => p.bedrooms >= 3 && p.bedrooms <= 4).length,
      '5+': data.filter(p => p.bedrooms >= 5).length
    }
  }

  return new Response(JSON.stringify({ data: stats }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function recordPropertyView(supabaseClient: any, propertyId: string) {
  try {
    await supabaseClient
      .from('property_views_final_2026_02_21_17_30')
      .insert({
        property_id: propertyId,
        viewed_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Error recording property view:', error)
  }
}