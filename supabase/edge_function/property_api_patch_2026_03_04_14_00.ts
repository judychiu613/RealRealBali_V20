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

    console.log('Patch API called:', { endpoint, language, limit })

    // 调用原API
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

    // 简单添加描述字段（使用固定内容，确保能看到效果）
    const enhancedData = originalData.map((property: any) => {
      const isLand = property.type_id === 'land' || property.type?.en === 'Land'
      
      return {
        ...property,
        description_zh: isLand 
          ? '这是一块优质的土地，位置绝佳，投资潜力巨大。土地平整，适合各种开发项目，周边配套设施完善，交通便利。'
          : '这是一处精美的别墅，设计现代，装修豪华。拥有宽敞的居住空间，私人花园和游泳池，是理想的度假和投资选择。',
        description_en: isLand
          ? 'This is a premium land with excellent location and great investment potential. The land is flat and suitable for various development projects, with complete surrounding facilities and convenient transportation.'
          : 'This is a beautiful villa with modern design and luxury decoration. It features spacious living areas, private garden and swimming pool, making it an ideal choice for vacation and investment.'
      }
    })

    console.log('Enhanced data prepared:', enhancedData.length)
    if (enhancedData.length > 0) {
      console.log('Sample enhanced property:', {
        id: enhancedData[0].id,
        has_description_zh: !!enhancedData[0].description_zh,
        has_description_en: !!enhancedData[0].description_en
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