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
    // 最基础的响应测试
    const basicResponse = {
      success: true,
      message: "Basic API working",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    };

    return new Response(
      JSON.stringify(basicResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in basic API:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Basic API error',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});