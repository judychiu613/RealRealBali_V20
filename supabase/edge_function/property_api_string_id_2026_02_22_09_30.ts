import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, X-Client-Info, apikey, Content-Type, X-Application-Name',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()
    
    console.log('API Request:', path, url.search)

    // Helper function to safely parse tags
    const parseTags = (tags: any): string[] => {
      if (!tags) return [];
      if (typeof tags === 'string') {
        try {
          return JSON.parse(tags);
        } catch {
          return tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
        }
      }
      if (Array.isArray(tags)) return tags;
      return [];
    };

    // Get property types endpoint
    if (path === 'types') {
      const { data: types, error } = await supabaseClient
        .from('property_types_final_2026_02_22_09_30')
        .select('*')
        .order('sort_order');

      if (error) {
        console.error('Types error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ data: types }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get single property
    if (path === 'property') {
      const propertyId = url.searchParams.get('id');
      if (!propertyId) {
        return new Response(JSON.stringify({ error: 'Property ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: property, error } = await supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select(`
          *,
          area:property_areas_final_2026_02_21_17_30(name_en, name_zh),
          type:property_types_final_2026_02_22_09_30(id, name_en, name_zh),
          landZone:land_zones_2026_02_22_06_00(name_en, name_zh)
        `)
        .eq('id', propertyId)
        .single();

      if (error) {
        console.error('Property fetch error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Process the property data
      const processedProperty = {
        ...property,
        title: {
          en: property.title_en || 'Luxury Property',
          zh: property.title_zh || '豪华房产'
        },
        description: {
          en: property.description_en || 'Beautiful property in Bali',
          zh: property.description_zh || '巴厘岛美丽房产'
        },
        location: {
          en: property.area?.name_en || 'Unknown',
          zh: property.area?.name_zh || '未知'
        },
        type: {
          en: property.type?.name_en || 'Property',
          zh: property.type?.name_zh || '房产'
        },
        landZone: property.landZone ? {
          en: property.landZone.name_en,
          zh: property.landZone.name_zh
        } : null,
        tags: parseTags(property.tags_zh),
        leaseholdYears: property.leasehold_years
      };

      return new Response(JSON.stringify({ data: processedProperty }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get properties list
    if (path === 'properties' || path === 'featured') {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const typeFilter = url.searchParams.get('type');

      let query = supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select(`
          *,
          area:property_areas_final_2026_02_21_17_30(name_en, name_zh),
          type:property_types_final_2026_02_22_09_30(id, name_en, name_zh),
          landZone:land_zones_2026_02_22_06_00(name_en, name_zh)
        `);

      // Apply filters
      if (path === 'featured') {
        query = query.eq('is_featured', true);
      }
      
      if (typeFilter) {
        query = query.eq('type_id', typeFilter);
      }

      const { data: properties, error } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Properties fetch error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Process properties data
      const processedProperties = properties.map(property => ({
        ...property,
        title: {
          en: property.title_en || 'Luxury Property',
          zh: property.title_zh || '豪华房产'
        },
        description: {
          en: property.description_en || 'Beautiful property in Bali',
          zh: property.description_zh || '巴厘岛美丽房产'
        },
        location: {
          en: property.area?.name_en || 'Unknown',
          zh: property.area?.name_zh || '未知'
        },
        type: {
          en: property.type?.name_en || 'Property',
          zh: property.type?.name_zh || '房产'
        },
        landZone: property.landZone ? {
          en: property.landZone.name_en,
          zh: property.landZone.name_zh
        } : null,
        tags: parseTags(property.tags_zh),
        leaseholdYears: property.leasehold_years
      }));

      return new Response(JSON.stringify({ 
        data: processedProperties,
        count: processedProperties.length,
        offset,
        limit
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})