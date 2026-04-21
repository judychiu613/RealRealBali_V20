import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

interface InquiryData {
  inquiry_type: 'contact_form' | 'property_inquiry';
  property_id?: string;
  name: string;
  email: string;
  country_code: string;
  phone: string;
  subject?: string;
  message: string;
  preferred_language?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'POST') {
      // Get user from Authorization header
      const authHeader = req.headers.get('Authorization');
      let userId = null;
      
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id || null;
      }

      // Parse request body
      const inquiryData: InquiryData = await req.json();

      // Validate required fields
      if (!inquiryData.name || !inquiryData.email || !inquiryData.message) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Missing required fields: name, email, message' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Validate inquiry_type
      if (!['contact_form', 'property_inquiry'].includes(inquiryData.inquiry_type)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid inquiry_type. Must be contact_form or property_inquiry' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // For property inquiries, property_id is required
      if (inquiryData.inquiry_type === 'property_inquiry' && !inquiryData.property_id) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'property_id is required for property inquiries' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Prepare data for insertion
      const insertData = {
        user_id: userId,
        property_id: inquiryData.property_id || null,
        inquiry_type: inquiryData.inquiry_type,
        name: inquiryData.name.trim(),
        email: inquiryData.email.trim().toLowerCase(),
        country_code: inquiryData.country_code || '+62',
        phone: inquiryData.phone.trim(),
        subject: inquiryData.subject?.trim() || null,
        message: inquiryData.message.trim(),
        preferred_language: inquiryData.preferred_language || 'zh',
        status: 'pending'
      };

      // Insert inquiry into database
      const { data, error } = await supabase
        .from('user_inquiries')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to save inquiry' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data,
          message: 'Inquiry submitted successfully' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // GET method - retrieve user's inquiries
    if (req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Authorization required' 
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (!user) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid token' 
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get user's inquiries
      const { data, error } = await supabase
        .from('user_inquiries')
        .select(`
          *,
          properties (
            id,
            title,
            location,
            price,
            image
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch inquiries' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: data 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});