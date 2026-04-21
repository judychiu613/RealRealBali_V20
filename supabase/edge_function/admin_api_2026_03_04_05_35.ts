import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

// 权限验证中间件
async function verifyAdminRole(supabaseClient: any, requiredRole: string[] = ['super_admin', 'property_admin']) {
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Unauthorized: No valid user session');
  }

  const { data: userRole, error: roleError } = await supabaseClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleError || !userRole) {
    throw new Error('Unauthorized: No role found');
  }

  if (!requiredRole.includes(userRole.role)) {
    throw new Error(`Unauthorized: Required role ${requiredRole.join(' or ')}, got ${userRole.role}`);
  }

  return { user, role: userRole.role };
}

// 记录操作日志
async function logOperation(
  supabaseClient: any, 
  operatorId: string, 
  operationType: string, 
  targetType: string, 
  targetId: string, 
  oldStatus?: string, 
  newStatus?: string, 
  description?: string
) {
  await supabaseClient
    .from('admin_operation_logs')
    .insert({
      operator_id: operatorId,
      operation_type: operationType,
      target_type: targetType,
      target_id: targetId,
      old_status: oldStatus,
      new_status: newStatus,
      description: description
    });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    );

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];

    switch (endpoint) {
      // 1. 获取待审核房源列表
      case 'pending-properties': {
        const { user, role } = await verifyAdminRole(supabaseClient, ['super_admin']);
        
        const { data: properties, error } = await supabaseClient
          .from('properties')
          .select(`
            *,
            creator:created_by(email),
            approver:approved_by(email)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ data: properties }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 2. 审核房源（通过/拒绝）
      case 'approve-property': {
        const { user, role } = await verifyAdminRole(supabaseClient, ['super_admin']);
        const { propertyId, action, reason } = await req.json();

        if (!propertyId || !action) {
          return new Response(
            JSON.stringify({ error: 'Property ID and action are required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // 获取当前房源状态
        const { data: currentProperty, error: fetchError } = await supabaseClient
          .from('properties')
          .select('status')
          .eq('id', propertyId)
          .single();

        if (fetchError) throw fetchError;

        const newStatus = action === 'approve' ? 'available' : 'pending';
        const updateData: any = { status: newStatus };
        
        if (action === 'approve') {
          updateData.approved_by = user.id;
          updateData.approved_at = new Date().toISOString();
        }

        const { error: updateError } = await supabaseClient
          .from('properties')
          .update(updateData)
          .eq('id', propertyId);

        if (updateError) throw updateError;

        // 记录操作日志
        await logOperation(
          supabaseClient,
          user.id,
          'property_approval',
          'property',
          propertyId,
          currentProperty.status,
          newStatus,
          `房源${action === 'approve' ? '审核通过' : '审核拒绝'}${reason ? ': ' + reason : ''}`
        );

        return new Response(
          JSON.stringify({ 
            message: `Property ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
            propertyId,
            newStatus
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 3. 获取房源管理员的房源列表
      case 'my-properties': {
        const { user, role } = await verifyAdminRole(supabaseClient);
        
        let query = supabaseClient
          .from('properties')
          .select(`
            *,
            approver:approved_by(email)
          `)
          .order('created_at', { ascending: false });

        // 如果不是超级管理员，只能看自己的房源
        if (role !== 'super_admin') {
          query = query.eq('created_by', user.id);
        }

        const { data: properties, error } = await query;

        if (error) throw error;

        return new Response(
          JSON.stringify({ data: properties }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 4. 创建新房源
      case 'create-property': {
        const { user, role } = await verifyAdminRole(supabaseClient, ['super_admin', 'property_admin']);
        const propertyData = await req.json();

        // 设置创建者和初始状态
        const newProperty = {
          ...propertyData,
          created_by: user.id,
          status: 'pending',
          is_published: false // 待审核状态不发布
        };

        const { data: property, error } = await supabaseClient
          .from('properties')
          .insert(newProperty)
          .select()
          .single();

        if (error) throw error;

        // 记录操作日志
        await logOperation(
          supabaseClient,
          user.id,
          'property_creation',
          'property',
          property.id,
          null,
          'pending',
          '创建新房源'
        );

        return new Response(
          JSON.stringify({ 
            message: 'Property created successfully',
            data: property
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 5. 申请下架房源
      case 'request-takedown': {
        const { user, role } = await verifyAdminRole(supabaseClient, ['super_admin', 'property_admin']);
        const { propertyId, reason } = await req.json();

        if (!propertyId) {
          return new Response(
            JSON.stringify({ error: 'Property ID is required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        // 验证权限：property_admin只能操作自己的房源
        let query = supabaseClient
          .from('properties')
          .select('status, created_by')
          .eq('id', propertyId);

        if (role !== 'super_admin') {
          query = query.eq('created_by', user.id);
        }

        const { data: property, error: fetchError } = await query.single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabaseClient
          .from('properties')
          .update({ status: 'pending_unavailable' })
          .eq('id', propertyId);

        if (updateError) throw updateError;

        // 记录操作日志
        await logOperation(
          supabaseClient,
          user.id,
          'takedown_request',
          'property',
          propertyId,
          property.status,
          'pending_unavailable',
          `申请下架房源${reason ? ': ' + reason : ''}`
        );

        return new Response(
          JSON.stringify({ 
            message: 'Takedown request submitted successfully',
            propertyId
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 6. 获取数据统计 - 用户分析
      case 'user-analytics': {
        const { user, role } = await verifyAdminRole(supabaseClient, ['super_admin']);
        
        const days = parseInt(url.searchParams.get('days') || '30');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // 总注册用户数
        const { count: totalUsers } = await supabaseClient
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'user');

        // 日均浏览数据
        const { data: dailyViews, error: viewsError } = await supabaseClient
          .from('user_views')
          .select('created_at, user_id, session_id')
          .gte('created_at', startDate.toISOString());

        if (viewsError) throw viewsError;

        // 处理数据统计
        const dailyStats: Record<string, any> = {};
        const uniqueUsers = new Set();
        const registeredUsers = new Set();

        dailyViews?.forEach(view => {
          const date = view.created_at.split('T')[0];
          if (!dailyStats[date]) {
            dailyStats[date] = {
              date,
              totalViews: 0,
              uniqueVisitors: new Set(),
              registeredVisitors: new Set()
            };
          }
          
          dailyStats[date].totalViews++;
          dailyStats[date].uniqueVisitors.add(view.session_id);
          
          if (view.user_id) {
            dailyStats[date].registeredVisitors.add(view.user_id);
            registeredUsers.add(view.user_id);
          }
          
          uniqueUsers.add(view.session_id);
        });

        // 转换为数组格式
        const analytics = Object.values(dailyStats).map((day: any) => ({
          date: day.date,
          totalViews: day.totalViews,
          uniqueVisitors: day.uniqueVisitors.size,
          registeredVisitors: day.registeredVisitors.size,
          registeredRatio: day.registeredVisitors.size / day.uniqueVisitors.size
        }));

        return new Response(
          JSON.stringify({ 
            data: {
              totalUsers,
              totalUniqueVisitors: uniqueUsers.size,
              totalRegisteredVisitors: registeredUsers.size,
              dailyAnalytics: analytics.sort((a, b) => a.date.localeCompare(b.date))
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 7. 获取注册用户详细信息
      case 'registered-users': {
        const { user, role } = await verifyAdminRole(supabaseClient, ['super_admin']);
        
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = (page - 1) * limit;

        // 获取注册用户列表
        const { data: users, error: usersError } = await supabaseClient
          .from('user_roles')
          .select(`
            user_id,
            created_at,
            auth_users:user_id(email)
          `)
          .eq('role', 'user')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (usersError) throw usersError;

        // 获取每个用户的最后浏览时间和收藏数量
        const userDetails = await Promise.all(
          users?.map(async (user) => {
            // 最后浏览时间
            const { data: lastView } = await supabaseClient
              .from('user_views')
              .select('created_at')
              .eq('user_id', user.user_id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            // 收藏数量
            const { count: favoritesCount } = await supabaseClient
              .from('user_favorites_map')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.user_id);

            return {
              userId: user.user_id,
              email: user.auth_users?.email,
              registeredAt: user.created_at,
              lastViewAt: lastView?.created_at,
              favoritesCount: favoritesCount || 0
            };
          }) || []
        );

        return new Response(
          JSON.stringify({ data: userDetails }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 8. 获取房源表现分析
      case 'property-analytics': {
        const { user, role } = await verifyAdminRole(supabaseClient, ['super_admin']);
        
        const days = parseInt(url.searchParams.get('days') || '30');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // 获取房源浏览数据
        const { data: propertyViews, error } = await supabaseClient
          .from('user_views')
          .select(`
            property_id,
            user_id,
            view_duration,
            scroll_depth,
            created_at
          `)
          .gte('created_at', startDate.toISOString())
          .not('property_id', 'is', null);

        if (error) throw error;

        // 统计每个房源的表现
        const propertyStats: Record<string, any> = {};

        propertyViews?.forEach(view => {
          const propertyId = view.property_id;
          if (!propertyStats[propertyId]) {
            propertyStats[propertyId] = {
              propertyId,
              totalViews: 0,
              registeredViews: 0,
              anonymousViews: 0,
              totalDuration: 0,
              totalScrollDepth: 0,
              uniqueUsers: new Set()
            };
          }

          const stats = propertyStats[propertyId];
          stats.totalViews++;
          stats.totalDuration += view.view_duration || 0;
          stats.totalScrollDepth += view.scroll_depth || 0;

          if (view.user_id) {
            stats.registeredViews++;
            stats.uniqueUsers.add(view.user_id);
          } else {
            stats.anonymousViews++;
          }
        });

        // 转换为数组并计算平均值
        const analytics = Object.values(propertyStats).map((stats: any) => ({
          propertyId: stats.propertyId,
          totalViews: stats.totalViews,
          registeredViews: stats.registeredViews,
          anonymousViews: stats.anonymousViews,
          uniqueRegisteredUsers: stats.uniqueUsers.size,
          avgDuration: stats.totalViews > 0 ? Math.round(stats.totalDuration / stats.totalViews) : 0,
          avgScrollDepth: stats.totalViews > 0 ? Math.round(stats.totalScrollDepth / stats.totalViews) : 0
        }));

        return new Response(
          JSON.stringify({ data: analytics }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 9. 获取设备分析
      case 'device-analytics': {
        const { user, role } = await verifyAdminRole(supabaseClient, ['super_admin']);
        
        const { data: deviceData, error } = await supabaseClient
          .from('user_views')
          .select('device_type, device_subtype, browser_name, user_id')
          .not('device_type', 'is', null);

        if (error) throw error;

        const stats = {
          deviceTypes: {} as Record<string, number>,
          deviceSubtypes: {} as Record<string, number>,
          browsers: {} as Record<string, number>,
          registeredUserDevices: {} as Record<string, number>,
          anonymousUserDevices: {} as Record<string, number>
        };

        deviceData?.forEach(view => {
          // 设备类型统计
          if (view.device_type) {
            stats.deviceTypes[view.device_type] = (stats.deviceTypes[view.device_type] || 0) + 1;
            
            // 注册用户 vs 匿名用户设备统计
            if (view.user_id) {
              stats.registeredUserDevices[view.device_type] = (stats.registeredUserDevices[view.device_type] || 0) + 1;
            } else {
              stats.anonymousUserDevices[view.device_type] = (stats.anonymousUserDevices[view.device_type] || 0) + 1;
            }
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
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 10. 获取操作日志
      case 'operation-logs': {
        const { user, role } = await verifyAdminRole(supabaseClient);
        
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = (page - 1) * limit;

        let query = supabaseClient
          .from('admin_operation_logs')
          .select(`
            *,
            operator:operator_id(email)
          `)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        // Property admin只能看自己的日志
        if (role !== 'super_admin') {
          query = query.eq('operator_id', user.id);
        }

        const { data: logs, error } = await query;

        if (error) throw error;

        return new Response(
          JSON.stringify({ data: logs }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404 
          }
        );
    }

  } catch (error) {
    console.error('Error in admin API:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message?.includes('Unauthorized') ? 401 : 500
      }
    );
  }
});