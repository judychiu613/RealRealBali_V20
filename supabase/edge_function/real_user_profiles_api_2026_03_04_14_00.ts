import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 使用Service Role Key来绕过RLS限制，真实访问数据库
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // 使用Service Role Key
    )

    console.log('=== REAL DATABASE ACCESS START ===')
    console.log('Supabase URL:', Deno.env.get('SUPABASE_URL'))
    console.log('Using Service Role Key for database access')

    // 1. 获取user_profiles表的总记录数
    const { count: totalUsers, error: countError } = await supabaseClient
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    console.log('Total users count query result:', { totalUsers, countError })

    // 2. 获取最近创建的用户（前5条）
    const { data: recentUsers, error: recentError } = await supabaseClient
      .from('user_profiles')
      .select('id, email, full_name, created_at, preferred_language, preferred_currency')
      .order('created_at', { ascending: false })
      .limit(5)

    console.log('Recent users query result:', { recentUsers, recentError })

    // 3. 按语言偏好统计用户
    const { data: languageStats, error: langError } = await supabaseClient
      .from('user_profiles')
      .select('preferred_language')
      .not('preferred_language', 'is', null)

    console.log('Language stats query result:', { languageStats, langError })

    // 4. 按币种偏好统计用户
    const { data: currencyStats, error: currError } = await supabaseClient
      .from('user_profiles')
      .select('preferred_currency')
      .not('preferred_currency', 'is', null)

    console.log('Currency stats query result:', { currencyStats, currError })

    // 5. 获取有完整信息的用户数（姓名和电话都不为空）
    const { count: completeProfiles, error: completeError } = await supabaseClient
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .not('full_name', 'is', null)
      .not('phone_number', 'is', null)
      .neq('full_name', '')
      .neq('phone_number', '')

    console.log('Complete profiles count:', { completeProfiles, completeError })

    // 统计语言偏好分布
    const languageDistribution: Record<string, number> = {}
    if (languageStats && !langError) {
      languageStats.forEach((user: any) => {
        const lang = user.preferred_language || 'unknown'
        languageDistribution[lang] = (languageDistribution[lang] || 0) + 1
      })
    }

    // 统计币种偏好分布
    const currencyDistribution: Record<string, number> = {}
    if (currencyStats && !currError) {
      currencyStats.forEach((user: any) => {
        const currency = user.preferred_currency || 'unknown'
        currencyDistribution[currency] = (currencyDistribution[currency] || 0) + 1
      })
    }

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      database_status: {
        total_users: totalUsers || 0,
        complete_profiles: completeProfiles || 0,
        incomplete_profiles: (totalUsers || 0) - (completeProfiles || 0),
        recent_users: recentUsers || [],
        language_distribution: languageDistribution,
        currency_distribution: currencyDistribution
      },
      errors: {
        count_error: countError?.message || null,
        recent_error: recentError?.message || null,
        language_error: langError?.message || null,
        currency_error: currError?.message || null,
        complete_error: completeError?.message || null
      },
      raw_data: {
        total_users_raw: totalUsers,
        recent_users_raw: recentUsers,
        language_stats_raw: languageStats,
        currency_stats_raw: currencyStats,
        complete_profiles_raw: completeProfiles
      }
    }

    console.log('=== FINAL RESPONSE ===', response)

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('=== EDGE FUNCTION ERROR ===', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      details: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})