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
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Request received:', req.method, req.url);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];
    
    console.log('Endpoint:', endpoint);

    // Helper function to safely parse tags
    const parseTags = (tags: any): string[] => {
      if (!tags) return [];
      if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(t => t);
      if (Array.isArray(tags)) return tags;
      return [];
    };

    // Helper function to process property data
    const processProperty = async (property: any) => {
      try {
        console.log('Processing property:', property.id, 'area_id:', property.area_id);
        
        // Get images
        const { data: images, error: imageError } = await supabaseClient
          .from('property_images_final_2026_02_21_17_30')
          .select('image_url')
          .eq('property_id', property.id)
          .order('sort_order', { ascending: true });

        if (imageError) {
          console.error('Image fetch error for property', property.id, ':', imageError);
        }

        // Get area info - with explicit error handling
        let area = null;
        if (property.area_id) {
          const { data: areaData, error: areaError } = await supabaseClient
            .from('property_areas_final_2026_02_21_17_30')
            .select('name_en, name_zh')
            .eq('id', property.area_id)
            .single();

          if (areaError) {
            console.error('Area fetch error for property', property.id, 'area_id:', property.area_id, 'error:', areaError);
          } else {
            area = areaData;
            console.log('Area data found:', area);
          }
        }

        // Get type info
        const { data: type, error: typeError } = await supabaseClient
          .from('property_types_final_2026_02_21_17_30')
          .select('name_en, name_zh')
          .eq('id', property.type_id)
          .single();

        if (typeError) {
          console.error('Type fetch error for property', property.id, ':', typeError);
        }

        // Get land zone info
        let landZone = null;
        if (property.land_zone_id) {
          const { data: lz, error: lzError } = await supabaseClient
            .from('land_zones_2026_02_22_06_00')
            .select('id, name_en, name_zh')
            .eq('id', property.land_zone_id)
            .single();
          
          if (lzError) {
            console.error('Land zone fetch error for property', property.id, ':', lzError);
          } else if (lz) {
            landZone = {
              id: lz.id,
              zh: lz.name_zh,
              en: lz.name_en
            };
          }
        }

        return {
          id: property.id,
          title: {
            zh: property.title_zh || '豪华别墅',
            en: property.title_en || 'Luxury Villa'
          },
          location: {
            zh: area?.name_zh || 'Unknown',
            en: area?.name_en || 'Unknown'
          },
          type: {
            zh: type?.name_zh || 'Property',
            en: type?.name_en || 'Property'
          },
          price: property.price_usd || 0,
          priceUSD: property.price_usd || 0,
          priceCNY: property.price_cny || 0,
          priceIDR: property.price_idr || 0,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          landArea: property.land_area || 0,
          buildingArea: property.building_area || 0,
          buildYear: property.build_year,
          image: images?.[0]?.image_url || '',
          images: images?.map(img => img.image_url) || [],
          status: property.status || 'Available',
          ownership: property.ownership || 'Freehold',
          leaseholdYears: property.leasehold_years,
          landZone: landZone,
          description: {
            zh: property.description_zh || 'No description available',
            en: property.description_en || 'No description available'
          },
          featured: property.is_featured || false,
          tags: parseTags(property.tags_zh),
          tagsEn: parseTags(property.tags_en),
          coordinates: property.coordinates ? {
            lat: property.coordinates.lat,
            lng: property.coordinates.lng
          } : undefined
        };
      } catch (error) {
        console.error('Error processing property', property.id, ':', error);
        // Return basic property data even if related data fails
        return {
          id: property.id,
          title: {
            zh: property.title_zh || '豪华别墅',
            en: property.title_en || 'Luxury Villa'
          },
          location: { zh: 'Unknown', en: 'Unknown' },
          type: { zh: 'Property', en: 'Property' },
          price: property.price_usd || 0,
          priceUSD: property.price_usd || 0,
          priceCNY: property.price_cny || 0,
          priceIDR: property.price_idr || 0,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          landArea: property.land_area || 0,
          buildingArea: property.building_area || 0,
          buildYear: property.build_year,
          image: '',
          images: [],
          status: property.status || 'Available',
          ownership: property.ownership || 'Freehold',
          leaseholdYears: property.leasehold_years,
          landZone: null,
          description: { zh: 'No description available', en: 'No description available' },
          featured: property.is_featured || false,
          tags: [],
          tagsEn: [],
          coordinates: undefined
        };
      }
    };

    // Get all properties
    if (endpoint === 'properties') {
      console.log('Fetching all properties...');
      
      const { data: properties, error } = await supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Properties fetch error:', error);
        throw error;
      }

      console.log('Found', properties?.length || 0, 'properties');

      if (!properties || properties.length === 0) {
        return new Response(
          JSON.stringify({ data: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Process properties in batches to avoid timeout
      const batchSize = 5;
      const propertiesWithDetails = [];
      
      for (let i = 0; i < properties.length; i += batchSize) {
        const batch = properties.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(processProperty));
        propertiesWithDetails.push(...batchResults);
      }

      console.log('Processed', propertiesWithDetails.length, 'properties');

      return new Response(
        JSON.stringify({ data: propertiesWithDetails }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get featured properties
    if (endpoint === 'featured') {
      const limit = url.searchParams.get('limit') || '6';
      console.log('Fetching featured properties, limit:', limit);
      
      const { data: properties, error } = await supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(parseInt(limit));

      if (error) {
        console.error('Featured properties fetch error:', error);
        throw error;
      }

      console.log('Found', properties?.length || 0, 'featured properties');

      if (!properties || properties.length === 0) {
        return new Response(
          JSON.stringify({ data: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const propertiesWithDetails = await Promise.all(properties.map(processProperty));

      console.log('Processed', propertiesWithDetails.length, 'featured properties');

      return new Response(
        JSON.stringify({ data: propertiesWithDetails }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get single property by ID
    if (endpoint === 'property') {
      const propertyId = url.searchParams.get('id');
      if (!propertyId) {
        return new Response(
          JSON.stringify({ error: 'Property ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Fetching property by ID:', propertyId);

      const { data: property, error } = await supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) {
        console.error('Property fetch error:', error);
        throw error;
      }

      if (!property) {
        return new Response(
          JSON.stringify({ error: 'Property not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const propertyWithDetails = await processProperty(property);

      console.log('Processed property:', propertyId);

      return new Response(
        JSON.stringify({ data: propertyWithDetails }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});