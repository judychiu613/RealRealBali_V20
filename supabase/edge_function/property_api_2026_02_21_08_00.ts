import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
}

interface Database {
  public: {
    Tables: {
      property_areas_2026_02_21_08_00: {
        Row: {
          id: string
          name_en: string
          name_zh: string
          slug: string
          description_en: string | null
          description_zh: string | null
          image_url: string | null
          is_featured: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
      }
      property_types_2026_02_21_08_00: {
        Row: {
          id: string
          name_en: string
          name_zh: string
          slug: string
          description_en: string | null
          description_zh: string | null
          icon: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
      }
      properties_2026_02_21_08_00: {
        Row: {
          id: string
          title_en: string
          title_zh: string
          slug: string
          description_en: string | null
          description_zh: string | null
          area_id: string | null
          type_id: string | null
          price_usd: number
          price_idr: number | null
          price_cny: number | null
          price_per_sqm_usd: number | null
          bedrooms: number
          bathrooms: number
          building_area: number | null
          land_area: number | null
          status: 'available' | 'sold' | 'reserved' | 'off_market'
          ownership: 'freehold' | 'leasehold'
          land_type: 'residential' | 'commercial' | 'mixed' | 'agricultural'
          tags_en: any
          tags_zh: any
          latitude: number | null
          longitude: number | null
          address_en: string | null
          address_zh: string | null
          is_featured: boolean
          is_premium: boolean
          is_new: boolean
          is_published: boolean
          sort_order: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
      }
      property_images_2026_02_21_08_00: {
        Row: {
          id: string
          property_id: string
          image_url: string
          thumbnail_url: string | null
          alt_text_en: string | null
          alt_text_zh: string | null
          caption_en: string | null
          caption_zh: string | null
          is_primary: boolean
          sort_order: number
          image_type: string
          created_at: string
          updated_at: string
        }
      }
      property_amenities_2026_02_21_08_00: {
        Row: {
          id: string
          name_en: string
          name_zh: string
          icon: string | null
          category: string
          is_active: boolean
          sort_order: number
          created_at: string
        }
      }
      property_amenity_relations_2026_02_21_08_00: {
        Row: {
          id: string
          property_id: string
          amenity_id: string
          created_at: string
        }
      }
      property_inquiries_2026_02_21_08_00: {
        Row: {
          id: string
          property_id: string | null
          name: string
          email: string
          phone: string | null
          country: string | null
          message: string | null
          inquiry_type: string
          preferred_contact: string
          status: string
          assigned_to: string | null
          created_at: string
          updated_at: string
          contacted_at: string | null
        }
      }
      property_views_2026_02_21_08_00: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          session_id: string | null
          viewed_at: string
        }
      }
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    // Route: GET /property-api/areas - 获取所有区域
    if (path === '/property-api/areas' && method === 'GET') {
      const { data, error } = await supabaseClient
        .from('property_areas_2026_02_21_08_00')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Route: GET /property-api/types - 获取所有房产类型
    if (path === '/property-api/types' && method === 'GET') {
      const { data, error } = await supabaseClient
        .from('property_types_2026_02_21_08_00')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Route: GET /property-api/amenities - 获取所有设施
    if (path === '/property-api/amenities' && method === 'GET') {
      const { data, error } = await supabaseClient
        .from('property_amenities_2026_02_21_08_00')
        .select('*')
        .eq('is_active', true)
        .order('category, sort_order', { ascending: true })

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Route: GET /property-api/properties - 获取房产列表（支持过滤和分页）
    if (path === '/property-api/properties' && method === 'GET') {
      const searchParams = url.searchParams
      
      // 分页参数
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '12')
      const offset = (page - 1) * limit

      // 过滤参数
      const areaId = searchParams.get('area_id')
      const typeId = searchParams.get('type_id')
      const minPrice = searchParams.get('min_price')
      const maxPrice = searchParams.get('max_price')
      const bedrooms = searchParams.get('bedrooms')
      const bathrooms = searchParams.get('bathrooms')
      const status = searchParams.get('status')
      const ownership = searchParams.get('ownership')
      const featured = searchParams.get('featured')
      const search = searchParams.get('search')

      // 排序参数
      const sortBy = searchParams.get('sort_by') || 'created_at'
      const sortOrder = searchParams.get('sort_order') || 'desc'

      let query = supabaseClient
        .from('properties_2026_02_21_08_00')
        .select(`
          *,
          property_areas_2026_02_21_08_00!area_id(id, name_en, name_zh, slug),
          property_types_2026_02_21_08_00!type_id(id, name_en, name_zh, slug, icon),
          property_images_2026_02_21_08_00!inner(id, image_url, thumbnail_url, alt_text_en, alt_text_zh, is_primary, sort_order, image_type)
        `)
        .eq('is_published', true)

      // 应用过滤条件
      if (areaId) query = query.eq('area_id', areaId)
      if (typeId) query = query.eq('type_id', typeId)
      if (minPrice) query = query.gte('price_usd', parseFloat(minPrice))
      if (maxPrice) query = query.lte('price_usd', parseFloat(maxPrice))
      if (bedrooms) query = query.eq('bedrooms', parseInt(bedrooms))
      if (bathrooms) query = query.eq('bathrooms', parseInt(bathrooms))
      if (status) query = query.eq('status', status)
      if (ownership) query = query.eq('ownership', ownership)
      if (featured === 'true') query = query.eq('is_featured', true)

      // 搜索功能
      if (search) {
        query = query.or(`title_en.ilike.%${search}%,title_zh.ilike.%${search}%,description_en.ilike.%${search}%,description_zh.ilike.%${search}%`)
      }

      // 应用排序和分页
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      // 获取总数用于分页
      const { count: totalCount } = await supabaseClient
        .from('properties_2026_02_21_08_00')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      return new Response(JSON.stringify({ 
        success: true, 
        data,
        pagination: {
          page,
          limit,
          total: totalCount || 0,
          totalPages: Math.ceil((totalCount || 0) / limit)
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Route: GET /property-api/properties/:slug - 获取单个房产详情
    if (path.startsWith('/property-api/properties/') && method === 'GET') {
      const slug = path.split('/').pop()
      
      const { data, error } = await supabaseClient
        .from('properties_2026_02_21_08_00')
        .select(`
          *,
          property_areas_2026_02_21_08_00!area_id(id, name_en, name_zh, slug, description_en, description_zh),
          property_types_2026_02_21_08_00!type_id(id, name_en, name_zh, slug, description_en, description_zh, icon),
          property_images_2026_02_21_08_00(id, image_url, thumbnail_url, alt_text_en, alt_text_zh, caption_en, caption_zh, is_primary, sort_order, image_type),
          property_amenity_relations_2026_02_21_08_00(
            property_amenities_2026_02_21_08_00(id, name_en, name_zh, icon, category)
          )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (error) throw error

      // 记录浏览量
      const userAgent = req.headers.get('user-agent')
      const referer = req.headers.get('referer')
      const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')

      await supabaseClient
        .from('property_views_2026_02_21_08_00')
        .insert({
          property_id: data.id,
          ip_address: clientIP,
          user_agent: userAgent,
          referrer: referer,
          session_id: crypto.randomUUID()
        })

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Route: POST /property-api/inquiries - 创建房产询盘
    if (path === '/property-api/inquiries' && method === 'POST') {
      const body = await req.json()
      
      const { data, error } = await supabaseClient
        .from('property_inquiries_2026_02_21_08_00')
        .insert({
          property_id: body.property_id,
          name: body.name,
          email: body.email,
          phone: body.phone,
          country: body.country,
          message: body.message,
          inquiry_type: body.inquiry_type || 'general',
          preferred_contact: body.preferred_contact || 'email'
        })
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Route: GET /property-api/featured - 获取精选房产
    if (path === '/property-api/featured' && method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '6')
      
      const { data, error } = await supabaseClient
        .from('properties_2026_02_21_08_00')
        .select(`
          *,
          property_areas_2026_02_21_08_00!area_id(id, name_en, name_zh, slug),
          property_types_2026_02_21_08_00!type_id(id, name_en, name_zh, slug, icon),
          property_images_2026_02_21_08_00!inner(id, image_url, thumbnail_url, alt_text_en, alt_text_zh, is_primary, sort_order, image_type)
        `)
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(limit)

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Route: GET /property-api/similar/:propertyId - 获取相似房产
    if (path.startsWith('/property-api/similar/') && method === 'GET') {
      const propertyId = path.split('/').pop()
      const limit = parseInt(url.searchParams.get('limit') || '4')
      
      // 首先获取当前房产信息
      const { data: currentProperty } = await supabaseClient
        .from('properties_2026_02_21_08_00')
        .select('area_id, type_id, price_usd')
        .eq('id', propertyId)
        .single()

      if (!currentProperty) {
        throw new Error('Property not found')
      }

      // 查找相似房产（同区域或同类型，价格相近）
      const { data, error } = await supabaseClient
        .from('properties_2026_02_21_08_00')
        .select(`
          *,
          property_areas_2026_02_21_08_00!area_id(id, name_en, name_zh, slug),
          property_types_2026_02_21_08_00!type_id(id, name_en, name_zh, slug, icon),
          property_images_2026_02_21_08_00!inner(id, image_url, thumbnail_url, alt_text_en, alt_text_zh, is_primary, sort_order, image_type)
        `)
        .eq('is_published', true)
        .neq('id', propertyId)
        .or(`area_id.eq.${currentProperty.area_id},type_id.eq.${currentProperty.type_id}`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Route: GET /property-api/stats - 获取统计信息
    if (path === '/property-api/stats' && method === 'GET') {
      const [
        { count: totalProperties },
        { count: featuredProperties },
        { count: availableProperties },
        { count: totalViews }
      ] = await Promise.all([
        supabaseClient.from('properties_2026_02_21_08_00').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabaseClient.from('properties_2026_02_21_08_00').select('*', { count: 'exact', head: true }).eq('is_published', true).eq('is_featured', true),
        supabaseClient.from('properties_2026_02_21_08_00').select('*', { count: 'exact', head: true }).eq('is_published', true).eq('status', 'available'),
        supabaseClient.from('property_views_2026_02_21_08_00').select('*', { count: 'exact', head: true })
      ])

      return new Response(JSON.stringify({ 
        success: true, 
        data: {
          totalProperties: totalProperties || 0,
          featuredProperties: featuredProperties || 0,
          availableProperties: availableProperties || 0,
          totalViews: totalViews || 0
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 404 - Route not found
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Route not found',
      availableRoutes: [
        'GET /property-api/areas',
        'GET /property-api/types', 
        'GET /property-api/amenities',
        'GET /property-api/properties',
        'GET /property-api/properties/:slug',
        'GET /property-api/featured',
        'GET /property-api/similar/:propertyId',
        'GET /property-api/stats',
        'POST /property-api/inquiries'
      ]
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})