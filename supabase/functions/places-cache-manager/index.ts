
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PlacesCacheRequest {
  action: 'populate_area' | 'refresh_stale' | 'search_and_cache' | 'get_stats'
  area_id?: string
  search_query?: string
  latitude?: number
  longitude?: number
  radius?: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const googleApiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!googleApiKey) {
      throw new Error('Google Maps API key not configured')
    }

    const { action, area_id, search_query, latitude, longitude, radius } = await req.json() as PlacesCacheRequest

    console.log(`Places cache manager action: ${action}`)

    switch (action) {
      case 'populate_area':
        return await populateSearchArea(supabase, googleApiKey, area_id)
      
      case 'refresh_stale':
        return await refreshStaleData(supabase, googleApiKey)
      
      case 'search_and_cache':
        return await searchAndCache(supabase, googleApiKey, search_query || '', latitude!, longitude!, radius)
      
      case 'get_stats':
        return await getCacheStats(supabase)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Places cache manager error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getPlaceType(supabase: any, googleTypes: string[]): Promise<string> {
  if (!googleTypes || googleTypes.length === 0) {
    return 'other'
  }

  try {
    // Query place_type_mapping table for the best match
    const { data: mappings, error } = await supabase
      .from('place_type_mapping')
      .select('our_place_type, priority, is_food_related')
      .in('google_place_type', googleTypes)
      .order('priority', { ascending: false })
      .order('is_food_related', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error querying place type mapping:', error)
      return 'other'
    }

    if (mappings && mappings.length > 0) {
      return mappings[0].our_place_type
    }

    return 'other'
  } catch (error) {
    console.error('Error in getPlaceType:', error)
    return 'other'
  }
}

async function populateSearchArea(supabase: any, apiKey: string, areaId?: string) {
  // Get search areas to populate (prioritize by priority and last_populated_at)
  const { data: areas, error: areasError } = await supabase
    .from('search_areas')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false })
    .order('last_populated_at', { ascending: true, nullsFirst: true })
    .limit(areaId ? 1 : 3)

  if (areasError) {
    throw new Error(`Failed to fetch search areas: ${areasError.message}`)
  }

  const results = []
  for (const area of areas) {
    console.log(`Populating area: ${area.name}`)
    const populated = await populateAreaWithPlaces(supabase, apiKey, area)
    results.push({ area: area.name, ...populated })
    
    // Update last_populated_at
    await supabase
      .from('search_areas')
      .update({ last_populated_at: new Date().toISOString() })
      .eq('id', area.id)
  }

  return new Response(
    JSON.stringify({ success: true, results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function populateAreaWithPlaces(supabase: any, apiKey: string, area: any) {
  const placeTypes = ['restaurant', 'grocery_store', 'convenience_store', 'pharmacy', 'cafe', 'bakery']
  let totalCached = 0
  let totalApiCalls = 0

  for (const type of placeTypes) {
    try {
      // Rate limiting - wait between requests
      if (totalApiCalls > 0) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${area.center_latitude},${area.center_longitude}&` +
        `radius=${area.radius_meters}&` +
        `type=${type}&` +
        `key=${apiKey}`

      const response = await fetch(url)
      const data = await response.json()
      totalApiCalls++

      if (data.status === 'OK' && data.results) {
        for (const place of data.results) {
          const cached = await cachePlace(supabase, place)
          if (cached) totalCached++
        }
      }
    } catch (error) {
      console.error(`Error populating ${type} for ${area.name}:`, error)
    }
  }

  // Update cache statistics
  await supabase.rpc('update_cache_stats', {
    hits: 0,
    misses: totalApiCalls,
    saved: 0,
    new_places: totalCached,
    updated_places: 0
  })

  return { cached: totalCached, api_calls: totalApiCalls }
}

async function searchAndCache(supabase: any, apiKey: string, query: string, lat: number, lng: number, radius = 5000) {
  console.log(`Search and cache: ${query} at ${lat},${lng}`)
  
  // First check if we have cached results using the new search function
  const { data: cachedResults, error: searchError } = await supabase.rpc('find_places_within_radius', {
    search_lat: lat,
    search_lng: lng,
    radius_meters: radius,
    limit_count: 20
  })

  if (searchError) {
    console.error('Cache search error:', searchError)
  } else if (cachedResults && cachedResults.length > 0) {
    await supabase.rpc('update_cache_stats', { 
      hits: 1, 
      misses: 0, 
      saved: 1,
      new_places: 0,
      updated_places: 0
    })
    return new Response(
      JSON.stringify({ 
        success: true, 
        source: 'cache',
        results: cachedResults,
        count: cachedResults.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Cache miss - search Google Places API
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
      `query=${encodeURIComponent(query)}&` +
      `location=${lat},${lng}&` +
      `radius=${radius}&` +
      `key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK' && data.results) {
      const cachedPlaces = []
      for (const place of data.results.slice(0, 20)) {
        const cached = await cachePlace(supabase, place)
        if (cached) cachedPlaces.push(cached)
      }

      await supabase.rpc('update_cache_stats', { 
        hits: 0, 
        misses: 1, 
        saved: 0,
        new_places: cachedPlaces.length,
        updated_places: 0
      })

      return new Response(
        JSON.stringify({ 
          success: true, 
          source: 'api',
          results: cachedPlaces,
          count: cachedPlaces.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Google Places API error:', error)
  }

  return new Response(
    JSON.stringify({ success: true, source: 'none', results: [], count: 0 }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function cachePlace(supabase: any, place: any) {
  if (!place.place_id || !place.geometry?.location) {
    return null
  }

  const googleTypes = place.types || []
  const primaryType = await getPlaceType(supabase, googleTypes)

  // Calculate next refresh time (7 days for fresh data)
  const nextRefresh = new Date()
  nextRefresh.setDate(nextRefresh.getDate() + 7)

  const placeData = {
    place_id: place.place_id,
    name: place.name || 'Unknown',
    formatted_address: place.formatted_address,
    location: `POINT(${place.geometry.location.lng} ${place.geometry.location.lat})`,
    place_types: googleTypes,
    primary_type: primaryType,
    google_primary_type: googleTypes[0] || null,
    rating: place.rating,
    price_level: place.price_level,
    phone_number: place.formatted_phone_number,
    website: place.website,
    opening_hours: place.opening_hours,
    is_open_now: place.opening_hours?.open_now,
    photo_references: place.photos?.map((p: any) => p.photo_reference) || [],
    timezone: null, // Could be enhanced with timezone detection
    quality_score: 5, // Default quality score
    verification_count: 0,
    data_source: 'google_places',
    next_refresh_at: nextRefresh.toISOString(),
    freshness_status: 'fresh',
    raw_google_data: place
  }

  // Upsert the place (insert or update if exists)
  const { data, error } = await supabase
    .from('cached_places')
    .upsert(placeData, { 
      onConflict: 'place_id',
      ignoreDuplicates: false 
    })
    .select()
    .single()

  if (error) {
    console.error('Error caching place:', error)
    return null
  }

  return data
}

async function refreshStaleData(supabase: any, apiKey: string) {
  // Get stale places (older than 7 days or marked as stale)
  const staleDate = new Date()
  staleDate.setDate(staleDate.getDate() - 7)

  const { data: stalePlaces, error } = await supabase
    .from('cached_places')
    .select('*')
    .or(`last_updated_at.lt.${staleDate.toISOString()},freshness_status.eq.stale`)
    .limit(50)

  if (error) {
    throw new Error(`Failed to fetch stale places: ${error.message}`)
  }

  let refreshed = 0
  for (const place of stalePlaces) {
    try {
      // Get fresh details from Google
      const url = `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${place.place_id}&` +
        `fields=place_id,name,formatted_address,geometry,rating,price_level,opening_hours,photos,types&` +
        `key=${apiKey}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'OK' && data.result) {
        await cachePlace(supabase, data.result)
        refreshed++
      } else {
        // Mark as stale if we can't refresh
        await supabase
          .from('cached_places')
          .update({ freshness_status: 'stale' })
          .eq('place_id', place.place_id)
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Error refreshing place ${place.place_id}:`, error)
    }
  }

  return new Response(
    JSON.stringify({ success: true, refreshed }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getCacheStats(supabase: any) {
  const { data: stats, error } = await supabase
    .from('cache_statistics')
    .select('*')
    .order('date', { ascending: false })
    .limit(30)

  if (error) {
    throw new Error(`Failed to fetch cache stats: ${error.message}`)
  }

  const { data: totalPlaces } = await supabase
    .from('cached_places')
    .select('count')
    .single()

  return new Response(
    JSON.stringify({ 
      success: true, 
      stats,
      total_places: totalPlaces?.count || 0
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
