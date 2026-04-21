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

    // Get all properties with land zone information
    if (endpoint === 'properties') {
      const { data: properties, error } = await supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select(`
          *,
          property_areas_final_2026_02_21_17_30!inner(name_en, name_zh),
          property_types_final_2026_02_21_17_30!inner(name_en, name_zh),
          land_zones_2026_02_22_06_00(id, name_en, name_zh)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get images for each property
      const propertiesWithImages = await Promise.all(
        properties.map(async (property) => {
          const { data: images } = await supabaseClient
            .from('property_images_final_2026_02_21_17_30')
            .select('image_url')
            .eq('property_id', property.id)
            .order('sort_order', { ascending: true });

          return {
            id: property.id,
            title: property.title,
            location: {
              zh: property.property_areas_final_2026_02_21_17_30?.name_zh || property.location_zh,
              en: property.property_areas_final_2026_02_21_17_30?.name_en || property.location_en
            },
            type: {
              zh: property.property_types_final_2026_02_21_17_30?.name_zh || property.type_zh,
              en: property.property_types_final_2026_02_21_17_30?.name_en || property.type_en
            },
            price: property.price_usd,
            priceUSD: property.price_usd,
            priceCNY: property.price_cny,
            priceIDR: property.price_idr,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            landArea: property.land_area,
            buildingArea: property.building_area,
            buildYear: property.build_year,
            image: images?.[0]?.image_url || '',
            images: images?.map(img => img.image_url) || [],
            status: property.status,
            ownership: property.ownership,
            leaseholdYears: property.leasehold_years,
            landZone: property.land_zones_2026_02_22_06_00 ? {
              id: property.land_zones_2026_02_22_06_00.id,
              zh: property.land_zones_2026_02_22_06_00.name_zh,
              en: property.land_zones_2026_02_22_06_00.name_en
            } : null,
            description: {
              zh: property.description_zh,
              en: property.description_en
            },
            featured: property.is_featured,
            tags: property.tags_zh ? property.tags_zh.split(',') : [],
            tagsEn: property.tags_en ? property.tags_en.split(',') : [],
            coordinates: property.coordinates ? {
              lat: property.coordinates.lat,
              lng: property.coordinates.lng
            } : undefined
          };
        })
      );

      return new Response(
        JSON.stringify({ data: propertiesWithImages }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get featured properties with land zone information
    if (endpoint === 'featured') {
      const limit = url.searchParams.get('limit') || '6';
      
      const { data: properties, error } = await supabaseClient
        .from('properties_final_2026_02_21_17_30')
        .select(`
          *,
          property_areas_final_2026_02_21_17_30!inner(name_en, name_zh),
          property_types_final_2026_02_21_17_30!inner(name_en, name_zh),
          land_zones_2026_02_22_06_00(id, name_en, name_zh)
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(parseInt(limit));

      if (error) throw error;

      // Get images for each property
      const propertiesWithImages = await Promise.all(
        properties.map(async (property) => {
          const { data: images } = await supabaseClient
            .from('property_images_final_2026_02_21_17_30')
            .select('image_url')
            .eq('property_id', property.id)
            .order('sort_order', { ascending: true });

          return {
            id: property.id,
            title: property.title,
            location: {
              zh: property.property_areas_final_2026_02_21_17_30?.name_zh || property.location_zh,
              en: property.property_areas_final_2026_02_21_17_30?.name_en || property.location_en
            },
            type: {
              zh: property.property_types_final_2026_02_21_17_30?.name_zh || property.type_zh,
              en: property.property_types_final_2026_02_21_17_30?.name_en || property.type_en
            },
            price: property.price_usd,
            priceUSD: property.price_usd,
            priceCNY: property.price_cny,
            priceIDR: property.price_idr,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            landArea: property.land_area,
            buildingArea: property.building_area,
            buildYear: property.build_year,
            image: images?.[0]?.image_url || '',
            images: images?.map(img => img.image_url) || [],
            status: property.status,
            ownership: property.ownership,
            leaseholdYears: property.leasehold_years,
            landZone: property.land_zones_2026_02_22_06_00 ? {
              id: property.land_zones_2026_02_22_06_00.id,
              zh: property.land_zones_2026_02_22_06_00.name_zh,
              en: property.land_zones_2026_02_22_06_00.name_en
            } : null,
            description: {
              zh: property.description_zh,
              en: property.description_en
            },
            featured: property.is_featured,
            tags: property.tags_zh ? property.tags_zh.split(',') : [],
            tagsEn: property.tags_en ? property.tags_en.split(',') : [],
            coordinates: property.coordinates ? {
              lat: property.coordinates.lat,
              lng: property.coordinates.lng
            } : undefined
          };
        })
      );

      return new Response(
        JSON.stringify({ data: propertiesWithImages }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get single property by ID with land zone information
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
        .select(`
          *,
          property_areas_final_2026_02_21_17_30!inner(name_en, name_zh),
          property_types_final_2026_02_21_17_30!inner(name_en, name_zh),
          land_zones_2026_02_22_06_00(id, name_en, name_zh)
        `)
        .eq('id', propertyId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      // Get images for the property
      const { data: images } = await supabaseClient
        .from('property_images_final_2026_02_21_17_30')
        .select('image_url')
        .eq('property_id', property.id)
        .order('sort_order', { ascending: true });

      const propertyWithImages = {
        id: property.id,
        title: property.title,
        location: {
          zh: property.property_areas_final_2026_02_21_17_30?.name_zh || property.location_zh,
          en: property.property_areas_final_2026_02_21_17_30?.name_en || property.location_en
        },
        type: {
          zh: property.property_types_final_2026_02_21_17_30?.name_zh || property.type_zh,
          en: property.property_types_final_2026_02_21_17_30?.name_en || property.type_en
        },
        price: property.price_usd,
        priceUSD: property.price_usd,
        priceCNY: property.price_cny,
        priceIDR: property.price_idr,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        landArea: property.land_area,
        buildingArea: property.building_area,
        buildYear: property.build_year,
        image: images?.[0]?.image_url || '',
        images: images?.map(img => img.image_url) || [],
        status: property.status,
        ownership: property.ownership,
        leaseholdYears: property.leasehold_years,
        landZone: property.land_zones_2026_02_22_06_00 ? {
          id: property.land_zones_2026_02_22_06_00.id,
          zh: property.land_zones_2026_02_22_06_00.name_zh,
          en: property.land_zones_2026_02_22_06_00.name_en
        } : null,
        description: {
          zh: property.description_zh,
          en: property.description_en
        },
        featured: property.is_featured,
        tags: property.tags_zh ? property.tags_zh.split(',') : [],
        tagsEn: property.tags_en ? property.tags_en.split(',') : [],
        coordinates: property.coordinates ? {
          lat: property.coordinates.lat,
          lng: property.coordinates.lng
        } : undefined
      };

      return new Response(
        JSON.stringify({ data: propertyWithImages }),
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