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

    console.log('All descriptions query - no limit')

    // 查询所有房源的描述字段，不限制数量
    const { data, error } = await supabaseClient
      .from('properties')
      .select('id, title_zh, description_zh, description_en, status')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('All descriptions query result:', data?.length || 0, 'records')

    if (data && data.length > 0) {
      const withDesc = data.filter(r => r.description_zh || r.description_en)
      const withoutDesc = data.filter(r => !r.description_zh && !r.description_en)
      
      console.log('Records with descriptions:', withDesc.length)
      console.log('Records without descriptions:', withoutDesc.length)
      
      // 显示前几个有描述的记录
      withDesc.slice(0, 3).forEach((record, index) => {
        console.log(`Sample ${index + 1}:`, {
          id: record.id,
          title_zh: record.title_zh,
          status: record.status,
          description_zh_length: record.description_zh ? record.description_zh.length : 0,
          description_en_length: record.description_en ? record.description_en.length : 0
        })
      })
      
      // 显示没有描述的记录ID
      if (withoutDesc.length > 0) {
        console.log('Records without descriptions:', withoutDesc.map(r => r.id))
      }
    }

    return new Response(JSON.stringify({
      success: true,
      count: data?.length || 0,
      data: data,
      message: `Found ${data?.length || 0} total records`
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