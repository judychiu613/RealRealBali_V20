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

    console.log('Simple description test API called')

    // 最简单的查询，只查询一条记录的描述字段
    const { data, error } = await supabaseClient
      .from('properties')
      .select('id, title_zh, description_zh, description_en')
      .eq('status', 'Available')
      .limit(1)

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Query result:', data)

    if (data && data.length > 0) {
      console.log('First record:', {
        id: data[0].id,
        title_zh: data[0].title_zh,
        description_zh: data[0].description_zh ? 'HAS_DATA' : 'NULL_OR_EMPTY',
        description_en: data[0].description_en ? 'HAS_DATA' : 'NULL_OR_EMPTY',
        description_zh_length: data[0].description_zh ? data[0].description_zh.length : 0,
        description_en_length: data[0].description_en ? data[0].description_en.length : 0
      })
    }

    return new Response(JSON.stringify({
      success: true,
      count: data?.length || 0,
      data: data
    }), {
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