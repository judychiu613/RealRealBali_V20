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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const propertyId = url.searchParams.get('id') || 'prop-001';

    // Get raw property data
    const { data: property, error: propError } = await supabaseClient
      .from('properties_final_2026_02_21_17_30')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propError) {
      return new Response(
        JSON.stringify({ error: 'Property error', details: propError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all areas
    const { data: areas, error: areaError } = await supabaseClient
      .from('property_areas_final_2026_02_21_17_30')
      .select('*');

    if (areaError) {
      return new Response(
        JSON.stringify({ error: 'Area error', details: areaError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try to find matching area
    const matchingArea = areas?.find(area => area.id === property.area_id);

    return new Response(
      JSON.stringify({ 
        property: property,
        all_areas: areas,
        matching_area: matchingArea,
        area_id_from_property: property.area_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});