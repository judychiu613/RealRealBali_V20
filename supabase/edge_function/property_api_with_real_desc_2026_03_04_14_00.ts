import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const url = new URL(req.url)
    const endpoint = url.pathname.split('/').pop()
    const language = url.searchParams.get('language') || 'zh'
    const limit = url.searchParams.get('limit') || '50'

    console.log('Enhanced API called:', { endpoint, language, limit })

    // 先调用原API获取基础数据
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
    console.log('Property IDs:', propertyIds)
    
    // 调用我们的直接查询API获取描述字段
    const descResponse = await fetch('https://ilusppbsxslyuzcifyeo.supabase.co/functions/v1/test_description_direct_2026_03_04_14_00')
    const descResult = await descResponse.json()
    
    console.log('Description data fetched:', descResult.count)

    // 合并数据
    const enhancedData = originalData.map((property: any) => {
      const descData = descResult.data?.find((d: any) => d.id === property.id)
      
      const enhanced = {
        ...property,
        description_zh: descData?.description_zh || null,
        description_en: descData?.description_en || null
      }
      
      if (descData) {
        console.log(`Enhanced property ${property.id}:`, {
          has_description_zh: !!enhanced.description_zh,
          has_description_en: !!enhanced.description_en
        })
      }
      
      return enhanced
    })

    console.log('Enhanced data prepared:', enhancedData.length)

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