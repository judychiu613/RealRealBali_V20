import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get environment variables
    const R2_ACCOUNT_ID = Deno.env.get('R2_ACCOUNT_ID');
    const R2_BUCKET_NAME = Deno.env.get('R2_BUCKET_NAME');
    const R2_TOKEN = Deno.env.get('R2_TOKEN');

    if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME || !R2_TOKEN) {
      console.error('Missing R2 environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const uploadResults = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      try {
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          uploadResults.push({
            filename: file.name,
            success: false,
            error: `Unsupported file type: ${file.type}`
          });
          continue;
        }

        // Validate file size
        if (file.size > maxSize) {
          uploadResults.push({
            filename: file.name,
            success: false,
            error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max 10MB)`
          });
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split('.').pop();
        const uniqueFilename = `property-images/${timestamp}-${randomString}.${fileExtension}`;

        // Convert file to ArrayBuffer
        const fileBuffer = await file.arrayBuffer();

        // Upload to Cloudflare R2
        const r2Url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET_NAME}/objects/${uniqueFilename}`;
        
        const uploadResponse = await fetch(r2Url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${R2_TOKEN}`,
            'Content-Type': file.type,
            'Content-Length': file.size.toString(),
          },
          body: fileBuffer,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('R2 upload failed:', errorText);
          uploadResults.push({
            filename: file.name,
            success: false,
            error: `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
          });
          continue;
        }

        // Generate public URL (assuming public bucket or custom domain)
        const publicUrl = `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com/${uniqueFilename}`;
        
        uploadResults.push({
          filename: file.name,
          success: true,
          url: publicUrl,
          key: uniqueFilename,
          size: file.size,
          type: file.type
        });

      } catch (error) {
        console.error('Error processing file:', file.name, error);
        uploadResults.push({
          filename: file.name,
          success: false,
          error: `Processing error: ${error.message}`
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: uploadResults,
        uploaded: uploadResults.filter(r => r.success).length,
        failed: uploadResults.filter(r => !r.success).length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Upload function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});