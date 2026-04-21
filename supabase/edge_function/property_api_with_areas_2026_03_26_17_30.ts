import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const url = new URL(req.url)
    const pathname = url.pathname
    const language = url.searchParams.get('language') || 'zh'
    const limit = parseInt(url.searchParams.get('limit') || '50')

    // 获取单个房源详情
    if (pathname.includes('/property')) {
      const propertyId = url.searchParams.get('id')
      
      if (!propertyId) {
        return new Response(
          JSON.stringify({ error: 'Property ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 查询房源，JOIN areas 表获取区域名称
      const { data: property, error } = await supabaseClient
        .from('properties')
        .select(`
          *,
          area:areas!properties_area_id_fkey(
            id,
            name_zh,
            name_en,
            parent_id
          ),
          images:property_images(image_url, sort_order)
        `)
        .eq('id', propertyId)
        .eq('published', true)
        .single()

      if (error) {
        console.error('Error fetching property:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!property) {
        return new Response(
          JSON.stringify({ error: 'Property not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 处理图片数据
      const sortedImages = property.images
        ?.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((img: any) => img.image_url) || []

      // 构建返回数据
      const responseData = {
        id: property.id,
        title: {
          zh: property.title_zh,
          en: property.title_en
        },
        description: {
          zh: property.description_zh,
          en: property.description_en
        },
        type: {
          zh: property.type_zh,
          en: property.type_en
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
        ownership: property.ownership,
        leaseholdYears: property.leasehold_years,
        landZone: property.land_zone ? {
          zh: property.land_zone_zh,
          en: property.land_zone_en
        } : null,
        area_id: property.area_id,
        // 新增：区域名称（只显示二级区域）
        area_name_zh: property.area?.name_zh || property.area_id,
        area_name_en: property.area?.name_en || property.area_id,
        location: {
          zh: property.area?.name_zh || property.location_zh,
          en: property.area?.name_en || property.location_en
        },
        tags: property.tags_zh || [],
        tagsEn: property.tags_en || [],
        image: sortedImages[0] || property.cover_image,
        images: sortedImages.length > 0 ? sortedImages : [property.cover_image],
        published: property.published,
        featured: property.featured
      }

      return new Response(
        JSON.stringify({ success: true, data: responseData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 获取房源列表
    if (pathname.includes('/properties')) {
      // 查询房源列表，JOIN areas 表
      const { data: properties, error } = await supabaseClient
        .from('properties')
        .select(`
          *,
          area:areas!properties_area_id_fkey(
            id,
            name_zh,
            name_en,
            parent_id
          ),
          images:property_images(image_url, sort_order)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching properties:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 处理数据
      const responseData = properties.map(property => {
        const sortedImages = property.images
          ?.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((img: any) => img.image_url) || []

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
          type: {
            zh: property.type_zh,
            en: property.type_en
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
          ownership: property.ownership,
          leaseholdYears: property.leasehold_years,
          landZone: property.land_zone ? {
            zh: property.land_zone_zh,
            en: property.land_zone_en
          } : null,
          area_id: property.area_id,
          // 新增：区域名称（只显示二级区域）
          area_name_zh: property.area?.name_zh || property.area_id,
          area_name_en: property.area?.name_en || property.area_id,
          location: {
            zh: property.area?.name_zh || property.location_zh,
            en: property.area?.name_en || property.location_en
          },
          tags: property.tags_zh || [],
          tags_zh: property.tags_zh || [],
          tags_en: property.tags_en || [],
          image: sortedImages[0] || property.cover_image,
          images: sortedImages.length > 0 ? sortedImages : [property.cover_image],
          published: property.published,
          featured: property.featured
        }
      })

      return new Response(
        JSON.stringify({ success: true, data: responseData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})