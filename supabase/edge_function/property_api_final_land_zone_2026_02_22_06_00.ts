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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const endpoint = pathSegments[pathSegments.length - 1];

    // Helper function to safely parse tags
    const parseTags = (tags: any): string[] => {
      if (!tags) return [];
      if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(t => t);
      if (Array.isArray(tags)) return tags;
      return [];
    };

    // Get all properties
    if (endpoint === 'properties') {
      const { data: properties, error } = await supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get related data for each property
      const propertiesWithDetails = await Promise.all(
        properties.map(async (property) => {
          // Get images
          const { data: images } = await supabaseClient
            .from('property_images_final_2026_02_21_17_30')
            .select('image_url')
            .eq('property_id', property.id)
            .order('sort_order', { ascending: true });

          // Get area info
          const { data: area } = await supabaseClient
            .from('property_areas_final_2026_02_21_17_30')
            .select('name_en, name_zh')
            .eq('id', property.area_id)
            .single();

          // Get type info
          const { data: type } = await supabaseClient
            .from('property_types_final_2026_02_21_17_30')
            .select('name_en, name_zh')
            .eq('id', property.type_id)
            .single();

          // Get land zone info
          let landZone = null;
          if (property.land_zone_id) {
            const { data: lz } = await supabaseClient
              .from('land_zones_2026_02_22_06_00')
              .select('id, name_en, name_zh')
              .eq('id', property.land_zone_id)
              .single();
            
            if (lz) {
              landZone = {
                id: lz.id,
                zh: lz.name_zh,
                en: lz.name_en
              };
            }
          }

          return {
            id: property.id,
            title: property.title || 'Luxury Property',
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
        })
      );

      return new Response(
        JSON.stringify({ data: propertiesWithDetails }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get featured properties
    if (endpoint === 'featured') {
      const limit = url.searchParams.get('limit') || '6';
      
      const { data: properties, error } = await supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(parseInt(limit));

      if (error) throw error;

      // Get related data for each property
      const propertiesWithDetails = await Promise.all(
        properties.map(async (property) => {
          // Get images
          const { data: images } = await supabaseClient
            .from('property_images_final_2026_02_21_17_30')
            .select('image_url')
            .eq('property_id', property.id)
            .order('sort_order', { ascending: true });

          // Get area info
          const { data: area } = await supabaseClient
            .from('property_areas_final_2026_02_21_17_30')
            .select('name_en, name_zh')
            .eq('id', property.area_id)
            .single();

          // Get type info
          const { data: type } = await supabaseClient
            .from('property_types_final_2026_02_21_17_30')
            .select('name_en, name_zh')
            .eq('id', property.type_id)
            .single();

          // Get land zone info
          let landZone = null;
          if (property.land_zone_id) {
            const { data: lz } = await supabaseClient
              .from('land_zones_2026_02_22_06_00')
              .select('id, name_en, name_zh')
              .eq('id', property.land_zone_id)
              .single();
            
            if (lz) {
              landZone = {
                id: lz.id,
                zh: lz.name_zh,
                en: lz.name_en
              };
            }
          }

          return {
            id: property.id,
            title: property.title || 'Luxury Property',
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
        })
      );

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

      const { data: property, error } = await supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;

      // Get images
      const { data: images } = await supabaseClient
        .from('property_images_final_2026_02_21_17_30')
        .select('image_url')
        .eq('property_id', property.id)
        .order('sort_order', { ascending: true });

      // Get area info
      const { data: area } = await supabaseClient
        .from('property_areas_final_2026_02_21_17_30')
        .select('name_en, name_zh')
        .eq('id', property.area_id)
        .single();

      // Get type info
      const { data: type } = await supabaseClient
        .from('property_types_final_2026_02_21_17_30')
        .select('name_en, name_zh')
        .eq('id', property.type_id)
        .single();

      // Get land zone info
      let landZone = null;
      if (property.land_zone_id) {
        const { data: lz } = await supabaseClient
          .from('land_zones_2026_02_22_06_00')
          .select('id, name_en, name_zh')
          .eq('id', property.land_zone_id)
          .single();
        
        if (lz) {
          landZone = {
            id: lz.id,
            zh: lz.name_zh,
            en: lz.name_en
          };
        }
      }

      const propertyWithDetails = {
        id: property.id,
        title: property.title || 'Luxury Property',
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
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});