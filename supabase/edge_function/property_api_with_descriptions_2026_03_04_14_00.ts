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

    console.log('Description API called:', { endpoint, language, limit })

    // 先调用原有API获取基础数据
    const originalApiUrl = `https://ilusppbsxslyuzcifyeo.supabase.co/functions/v1/property_api_complete_2026_03_04_06_00/${endpoint}?language=${language}&limit=${limit}`
    
    const originalResponse = await fetch(originalApiUrl, {
      headers: {
        'Authorization': req.headers.get('Authorization') || '',
        'apikey': req.headers.get('apikey') || '',
      }
    })

    if (!originalResponse.ok) {
      throw new Error(`Original API failed: ${originalResponse.status}`)
    }

    const originalData = await originalResponse.json()
    console.log('Original data fetched:', originalData.length)

    // 获取房源IDs
    const propertyIds = originalData.map((p: any) => p.id)
    
    // 查询description_zh和description_en字段
    const { data: descriptionData, error } = await supabaseClient
      .from('properties')
      .select('id, description_zh, description_en, tags_zh, tags_en')
      .in('id', propertyIds)

    if (error) {
      console.error('Description query error:', error)
      // 如果查询失败，返回原始数据
      return new Response(JSON.stringify(originalData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Description data fetched:', descriptionData?.length || 0)
    if (descriptionData && descriptionData.length > 0) {
      console.log('Sample description data:', {
        id: descriptionData[0].id,
        description_zh: descriptionData[0].description_zh ? 'HAS_DATA' : 'NULL/EMPTY',
        description_en: descriptionData[0].description_en ? 'HAS_DATA' : 'NULL/EMPTY',
        tags_zh: descriptionData[0].tags_zh,
        tags_en: descriptionData[0].tags_en
      })
    }

    // 合并数据
    const enhancedData = originalData.map((property: any) => {
      const extraInfo = descriptionData?.find(d => d.id === property.id)
      return {
        ...property,
        description_zh: extraInfo?.description_zh || null,
        description_en: extraInfo?.description_en || null,
        tags_zh: extraInfo?.tags_zh || [],
        tags_en: extraInfo?.tags_en || []
      }
    })

    console.log('Enhanced data prepared:', enhancedData.length)
    if (enhancedData.length > 0) {
      console.log('Sample enhanced property:', {
        id: enhancedData[0].id,
        has_description_zh: !!enhancedData[0].description_zh,
        has_description_en: !!enhancedData[0].description_en,
        description_zh_preview: enhancedData[0].description_zh ? enhancedData[0].description_zh.substring(0, 50) + '...' : 'NULL',
        description_en_preview: enhancedData[0].description_en ? enhancedData[0].description_en.substring(0, 50) + '...' : 'NULL'
      })
    }

    return new Response(JSON.stringify(enhancedData), {
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