import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

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
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];

    // 获取当前用户
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: '未授权访问' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: '用户认证失败' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // 获取用户角色
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return new Response(
        JSON.stringify({ success: false, error: '用户信息获取失败' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    const userRole = userProfile.role;
    const isSuperAdmin = userRole === 'super_admin';
    const isAdmin = userRole === 'admin' || isSuperAdmin;

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: '权限不足' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    switch (endpoint) {
      case 'properties': {
        // 获取所有房源（超级管理员）或我的房源（房源管理员）
        let query = supabaseClient
          .from('properties')
          .select(`
            *,
            property_images(image_url, sort_order),
            creator:created_by(full_name, email),
            approver:approved_by(full_name, email)
          `)
          .order('created_at', { ascending: false });

        // 如果不是超级管理员，只显示自己创建的房源
        if (!isSuperAdmin) {
          query = query.eq('created_by', user.id);
        }

        const { data: properties, error } = await query;

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: properties,
            count: properties?.length || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'my-properties': {
        // 获取当前用户的房源
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select(`
            *,
            property_images(image_url, sort_order)
          `)
          .eq('created_by', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: properties,
            count: properties?.length || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'pending-properties': {
        // 获取待审核房源（仅超级管理员）
        if (!isSuperAdmin) {
          return new Response(
            JSON.stringify({ success: false, error: '权限不足' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }

        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select(`
            *,
            property_images(image_url, sort_order),
            creator:created_by(full_name, email)
          `)
          .eq('approval_status', 'pending')
          .order('created_at', { ascending: true });

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: properties,
            count: properties?.length || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'approve-property': {
        // 审批房源（仅超级管理员）
        if (!isSuperAdmin) {
          return new Response(
            JSON.stringify({ success: false, error: '权限不足' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }

        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ success: false, error: '方法不允许' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
          );
        }

        const { property_id, action, reason } = await req.json();

        if (!property_id || !action) {
          return new Response(
            JSON.stringify({ success: false, error: '缺少必要参数' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // 调用数据库函数执行审批
        const { data, error } = await supabaseClient.rpc('approve_property', {
          property_id_param: property_id,
          action_param: action,
          reason_param: reason
        });

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'toggle-publish': {
        // 切换房源发布状态
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ success: false, error: '方法不允许' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
          );
        }

        const { property_id, is_published } = await req.json();

        if (!property_id || typeof is_published !== 'boolean') {
          return new Response(
            JSON.stringify({ success: false, error: '缺少必要参数' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // 检查权限：超级管理员可以操作所有房源，房源管理员只能操作自己的房源
        let query = supabaseClient
          .from('properties')
          .update({ is_published })
          .eq('id', property_id);

        if (!isSuperAdmin) {
          query = query.eq('created_by', user.id);
        }

        const { error } = await query;

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: '操作成功' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'toggle-featured': {
        // 切换特色房源状态（仅超级管理员）
        if (!isSuperAdmin) {
          return new Response(
            JSON.stringify({ success: false, error: '权限不足' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }

        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ success: false, error: '方法不允许' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
          );
        }

        const { property_id, is_featured } = await req.json();

        if (!property_id || typeof is_featured !== 'boolean') {
          return new Response(
            JSON.stringify({ success: false, error: '缺少必要参数' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        const { error } = await supabaseClient
          .from('properties')
          .update({ is_featured })
          .eq('id', property_id);

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: '操作成功' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'property-stats': {
        // 获取房源统计信息
        const { data, error } = await supabaseClient.rpc('get_property_stats');

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      case 'approval-logs': {
        // 获取审批日志（仅超级管理员）
        if (!isSuperAdmin) {
          return new Response(
            JSON.stringify({ success: false, error: '权限不足' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          );
        }

        const limit = parseInt(url.searchParams.get('limit') || '50');
        const property_id = url.searchParams.get('property_id');

        let query = supabaseClient
          .from('property_approval_logs')
          .select(`
            *,
            property:properties(title_zh, title_en),
            performer:user_profiles(full_name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (property_id) {
          query = query.eq('property_id', property_id);
        }

        const { data: logs, error } = await query;

        if (error) {
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: logs,
            count: logs?.length || 0
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: '端点不存在',
            available_endpoints: [
              'properties', 'my-properties', 'pending-properties', 
              'approve-property', 'toggle-publish', 'toggle-featured',
              'property-stats', 'approval-logs'
            ]
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
    }

  } catch (error) {
    console.error('Error in admin property API:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器内部错误',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});