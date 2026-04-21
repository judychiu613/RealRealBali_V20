import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

// User-Agent解析函数
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  let deviceType: 'desktop' | 'mobile' = 'desktop';
  let deviceSubtype: 'iphone' | 'android' | 'ipad' | null = null;
  let browserName = 'Unknown';
  
  // 设备类型检测
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    deviceType = 'mobile';
    
    // 移动设备子类型检测
    if (ua.includes('iphone')) {
      deviceSubtype = 'iphone';
    } else if (ua.includes('ipad')) {
      deviceSubtype = 'ipad';
    } else if (ua.includes('android')) {
      deviceSubtype = 'android';
    }
  }
  
  // 浏览器检测
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browserName = 'Chrome';
  } else if (ua.includes('firefox')) {
    browserName = 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browserName = 'Safari';
  } else if (ua.includes('edg')) {
    browserName = 'Edge';
  } else if (ua.includes('opera') || ua.includes('opr')) {
    browserName = 'Opera';
  } else if (ua.includes('msie') || ua.includes('trident')) {
    browserName = 'Internet Explorer';
  }
  
  return {
    deviceType,
    deviceSubtype,
    browserName
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'parse': {
        // 解析单个User-Agent
        const { userAgent } = await req.json();
        
        if (!userAgent) {
          return new Response(
            JSON.stringify({ error: 'User-Agent is required' }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400 
            }
          );
        }

        const parsed = parseUserAgent(userAgent);
        
        return new Response(
          JSON.stringify({ data: parsed }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'batch_update': {
        // 批量更新现有user_views记录的设备信息
        const limit = parseInt(url.searchParams.get('limit') || '100');
        
        // 获取需要更新的记录（没有设备信息的）
        const { data: views, error: fetchError } = await supabaseClient
          .from('user_views')
          .select('id, user_agent')
          .is('device_type', null)
          .not('user_agent', 'is', null)
          .limit(limit);

        if (fetchError) {
          throw fetchError;
        }

        if (!views || views.length === 0) {
          return new Response(
            JSON.stringify({ 
              message: 'No records to update',
              updated: 0 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          );
        }

        // 批量解析并更新
        const updates = views.map(view => {
          const parsed = parseUserAgent(view.user_agent);
          return {
            id: view.id,
            ...parsed
          };
        });

        // 执行批量更新
        let updatedCount = 0;
        for (const update of updates) {
          const { error: updateError } = await supabaseClient
            .from('user_views')
            .update({
              device_type: update.deviceType,
              device_subtype: update.deviceSubtype,
              browser_name: update.browserName
            })
            .eq('id', update.id);

          if (!updateError) {
            updatedCount++;
          }
        }

        return new Response(
          JSON.stringify({ 
            message: `Updated ${updatedCount} records`,
            updated: updatedCount,
            total: views.length
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      case 'stats': {
        // 获取设备统计信息
        const { data: deviceStats, error: deviceError } = await supabaseClient
          .from('user_views')
          .select('device_type, device_subtype, browser_name')
          .not('device_type', 'is', null);

        if (deviceError) {
          throw deviceError;
        }

        // 统计设备类型
        const stats = {
          deviceTypes: {} as Record<string, number>,
          deviceSubtypes: {} as Record<string, number>,
          browsers: {} as Record<string, number>,
          total: deviceStats?.length || 0
        };

        deviceStats?.forEach(view => {
          // 设备类型统计
          if (view.device_type) {
            stats.deviceTypes[view.device_type] = (stats.deviceTypes[view.device_type] || 0) + 1;
          }
          
          // 设备子类型统计
          if (view.device_subtype) {
            stats.deviceSubtypes[view.device_subtype] = (stats.deviceSubtypes[view.device_subtype] || 0) + 1;
          }
          
          // 浏览器统计
          if (view.browser_name) {
            stats.browsers[view.browser_name] = (stats.browsers[view.browser_name] || 0) + 1;
          }
        });

        return new Response(
          JSON.stringify({ data: stats }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: parse, batch_update, or stats' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
    }

  } catch (error) {
    console.error('Error in user-agent parser:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});