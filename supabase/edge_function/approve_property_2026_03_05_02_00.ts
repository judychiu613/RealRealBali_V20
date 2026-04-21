import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // 验证用户身份
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 检查用户是否为超级管理员
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Only super admin can approve properties' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'POST') {
      const { property_id, action, rejection_reason } = await req.json();
      
      if (!property_id || !action || !['approve', 'reject'].includes(action)) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields: property_id, action (approve/reject)' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'reject' && !rejection_reason) {
        return new Response(JSON.stringify({ 
          error: 'Rejection reason is required when rejecting a property' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 检查房源是否存在且状态为pending
      const { data: property, error: fetchError } = await supabaseClient
        .from('properties')
        .select('id, approval_status, title_zh')
        .eq('id', property_id)
        .single();

      if (fetchError || !property) {
        return new Response(JSON.stringify({ 
          error: 'Property not found' 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (property.approval_status !== 'pending') {
        return new Response(JSON.stringify({ 
          error: 'Property is not pending approval' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 更新房源状态
      const updateData = {
        approval_status: action === 'approve' ? 'approved' : 'rejected',
        approved_by: user.id,
        approved_at: new Date().toISOString(),
        updated_by: user.id,
        updated_at: new Date().toISOString(),
        ...(action === 'approve' && { 
          status: 'available',
          is_published: true 
        }),
        ...(action === 'reject' && { 
          rejection_reason: rejection_reason,
          status: 'draft',
          is_published: false 
        })
      };

      const { data: updatedProperty, error: updateError } = await supabaseClient
        .from('properties')
        .update(updateData)
        .eq('id', property_id)
        .select()
        .single();

      if (updateError) {
        console.error('Update error:', updateError);
        return new Response(JSON.stringify({ 
          error: 'Failed to update property status',
          details: updateError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        property: updatedProperty,
        message: `Property ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET请求 - 获取待审核房源列表
    if (req.method === 'GET') {
      const { data: pendingProperties, error: fetchError } = await supabaseClient
        .from('properties')
        .select(`
          id, title_zh, title_en, type_id, price_usd, area_id,
          created_by, created_at, approval_status, status
        `)
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) {
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch pending properties',
          details: fetchError.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        properties: pendingProperties || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});