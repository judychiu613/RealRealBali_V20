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

    console.log('Direct database query - no conditions')

    // 直接查询，不加任何条件
    const { data, error } = await supabaseClient
      .from('properties')
      .select('id, title_zh, description_zh, description_en, status')
      .limit(5)

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Direct query result:', data)
    console.log('Total records found:', data?.length || 0)

    if (data && data.length > 0) {
      data.forEach((record, index) => {
        console.log(`Record ${index + 1}:`, {
          id: record.id,
          title_zh: record.title_zh,
          status: record.status,
          description_zh_exists: !!record.description_zh,
          description_en_exists: !!record.description_en,
          description_zh_length: record.description_zh ? record.description_zh.length : 0,
          description_en_length: record.description_en ? record.description_en.length : 0,
          description_zh_preview: record.description_zh ? record.description_zh.substring(0, 50) + '...' : 'NULL',
          description_en_preview: record.description_en ? record.description_en.substring(0, 50) + '...' : 'NULL'
        })
      })
    } else {
      console.log('No records found in properties table')
    }

    return new Response(JSON.stringify({
      success: true,
      count: data?.length || 0,
      data: data,
      message: data?.length ? 'Records found' : 'No records in properties table'
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