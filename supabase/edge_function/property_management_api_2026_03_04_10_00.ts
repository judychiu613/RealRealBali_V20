import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

interface DatabaseError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: '未提供认证信息' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: '认证失败' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Get user profile and role
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return new Response(
        JSON.stringify({ success: false, error: '用户信息不存在' }),
        { status: 403, headers: corsHeaders }
      );
    }

    const isSuperAdmin = userProfile.role === 'super_admin';
    const isAdmin = userProfile.role === 'admin' || isSuperAdmin;

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: '权限不足' }),
        { status: 403, headers: corsHeaders }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop() || '';
    const method = req.method;

    // Route handling
    if (method === 'GET') {
      switch (path) {
        case 'properties':
          return await getProperties(supabase, user.id, isSuperAdmin);
        case 'my-properties':
          return await getMyProperties(supabase, user.id);
        case 'property-stats':
          return await getPropertyStats(supabase, user.id, isSuperAdmin);
        default:
          // Handle property detail by ID
          if (path.startsWith('property-')) {
            const propertyId = path.replace('property-', '');
            return await getPropertyDetail(supabase, propertyId, user.id, isSuperAdmin);
          }
          return new Response(
            JSON.stringify({ success: false, error: '未知的API端点' }),
            { status: 404, headers: corsHeaders }
          );
      }
    } else if (method === 'POST') {
      const body = await req.json();
      
      switch (path) {
        case 'toggle-publish':
          return await togglePublish(supabase, body, user.id, isSuperAdmin);
        case 'toggle-featured':
          return await toggleFeatured(supabase, body, user.id, isSuperAdmin);
        case 'approve-property':
          return await approveProperty(supabase, body, user.id, isSuperAdmin);
        case 'create-property':
          return await createProperty(supabase, body, user.id);
        case 'update-property':
          return await updateProperty(supabase, body, user.id, isSuperAdmin);
        case 'delete-property':
          return await deleteProperty(supabase, body, user.id, isSuperAdmin);
        default:
          return new Response(
            JSON.stringify({ success: false, error: '未知的API端点' }),
            { status: 404, headers: corsHeaders }
          );
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: '不支持的请求方法' }),
      { status: 405, headers: corsHeaders }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});

// Get all properties (super admin) or user's properties (admin)
async function getProperties(supabase: any, userId: string, isSuperAdmin: boolean) {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        creator:user_profiles!properties_created_by_fkey(full_name, email),
        approver:user_profiles!properties_approved_by_fkey(full_name, email)
      `)
      .order('created_at', { ascending: false });

    // If not super admin, only show user's properties
    if (!isSuperAdmin) {
      query = query.eq('created_by', userId);
    }

    const { data: properties, error } = await query;

    if (error) {
      throw error;
    }

    // Get property images
    const propertiesWithImages = await Promise.all(
      (properties || []).map(async (property: any) => {
        const { data: images } = await supabase
          .from('property_images')
          .select('image_url')
          .eq('property_id', property.id)
          .order('display_order');

        return {
          ...property,
          images: images?.map((img: any) => img.image_url) || []
        };
      })
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: propertiesWithImages,
        count: propertiesWithImages.length
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error getting properties:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '获取房源列表失败',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Get user's properties only
async function getMyProperties(supabase: any, userId: string) {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
        creator:user_profiles!properties_created_by_fkey(full_name, email),
        approver:user_profiles!properties_approved_by_fkey(full_name, email)
      `)
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Get property images
    const propertiesWithImages = await Promise.all(
      (properties || []).map(async (property: any) => {
        const { data: images } = await supabase
          .from('property_images')
          .select('image_url')
          .eq('property_id', property.id)
          .order('display_order');

        return {
          ...property,
          images: images?.map((img: any) => img.image_url) || []
        };
      })
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: propertiesWithImages,
        count: propertiesWithImages.length
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error getting my properties:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '获取我的房源失败',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Get property statistics
async function getPropertyStats(supabase: any, userId: string, isSuperAdmin: boolean) {
  try {
    let baseQuery = supabase.from('properties').select('status, approval_status, is_published, is_featured');
    
    if (!isSuperAdmin) {
      baseQuery = baseQuery.eq('created_by', userId);
    }

    const { data: properties, error } = await baseQuery;

    if (error) {
      throw error;
    }

    const stats = {
      totalProperties: properties?.length || 0,
      pendingProperties: properties?.filter((p: any) => p.approval_status === 'pending').length || 0,
      approvedProperties: properties?.filter((p: any) => p.approval_status === 'approved').length || 0,
      rejectedProperties: properties?.filter((p: any) => p.approval_status === 'rejected').length || 0,
      publishedProperties: properties?.filter((p: any) => p.is_published === true).length || 0,
      featuredProperties: properties?.filter((p: any) => p.is_featured === true).length || 0,
    };

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error getting property stats:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '获取统计数据失败',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Toggle property publish status
async function togglePublish(supabase: any, body: any, userId: string, isSuperAdmin: boolean) {
  try {
    const { property_id, is_published } = body;

    if (!property_id) {
      return new Response(
        JSON.stringify({ success: false, error: '缺少房源ID' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user owns the property or is super admin
    const { data: property, error: fetchError } = await supabase
      .from('properties')
      .select('created_by, approval_status')
      .eq('id', property_id)
      .single();

    if (fetchError || !property) {
      return new Response(
        JSON.stringify({ success: false, error: '房源不存在' }),
        { status: 404, headers: corsHeaders }
      );
    }

    if (!isSuperAdmin && property.created_by !== userId) {
      return new Response(
        JSON.stringify({ success: false, error: '无权限操作此房源' }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Only allow publishing approved properties
    if (is_published && property.approval_status !== 'approved') {
      return new Response(
        JSON.stringify({ success: false, error: '只有已审核通过的房源才能发布' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { error: updateError } = await supabase
      .from('properties')
      .update({ 
        is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', property_id);

    if (updateError) {
      throw updateError;
    }

    // Log the operation
    await supabase
      .from('admin_operation_logs')
      .insert({
        user_id: userId,
        action: is_published ? 'publish_property' : 'unpublish_property',
        target_type: 'property',
        target_id: property_id,
        details: { is_published }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: is_published ? '房源已发布' : '房源已取消发布'
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error toggling publish:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '操作失败',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Toggle property featured status (super admin only)
async function toggleFeatured(supabase: any, body: any, userId: string, isSuperAdmin: boolean) {
  try {
    if (!isSuperAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: '只有超级管理员可以设置特色房源' }),
        { status: 403, headers: corsHeaders }
      );
    }

    const { property_id, is_featured } = body;

    if (!property_id) {
      return new Response(
        JSON.stringify({ success: false, error: '缺少房源ID' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { error: updateError } = await supabase
      .from('properties')
      .update({ 
        is_featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', property_id);

    if (updateError) {
      throw updateError;
    }

    // Log the operation
    await supabase
      .from('admin_operation_logs')
      .insert({
        user_id: userId,
        action: is_featured ? 'set_featured' : 'unset_featured',
        target_type: 'property',
        target_id: property_id,
        details: { is_featured }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: is_featured ? '已设为特色房源' : '已取消特色房源'
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error toggling featured:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '操作失败',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Approve or reject property (super admin only)
async function approveProperty(supabase: any, body: any, userId: string, isSuperAdmin: boolean) {
  try {
    if (!isSuperAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: '只有超级管理员可以审核房源' }),
        { status: 403, headers: corsHeaders }
      );
    }

    const { property_id, action, reason } = body;

    if (!property_id || !action) {
      return new Response(
        JSON.stringify({ success: false, error: '缺少必要参数' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return new Response(
        JSON.stringify({ success: false, error: '无效的操作类型' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const approval_status = action === 'approve' ? 'approved' : 'rejected';
    
    const { error: updateError } = await supabase
      .from('properties')
      .update({ 
        approval_status,
        approved_by: userId,
        approved_at: new Date().toISOString(),
        rejection_reason: action === 'reject' ? reason : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', property_id);

    if (updateError) {
      throw updateError;
    }

    // Log the operation
    await supabase
      .from('admin_operation_logs')
      .insert({
        user_id: userId,
        action: `${action}_property`,
        target_type: 'property',
        target_id: property_id,
        details: { approval_status, reason }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: action === 'approve' ? '房源审核通过' : '房源审核拒绝'
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error approving property:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '审核操作失败',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}