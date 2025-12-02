/**
 * Edge API Client
 * Reads from Cloudflare Workers (fast, global)
 * Writes to Supabase (source of truth)
 */

import { supabase } from '@/integrations/supabase/client';

export interface SearchParams {
  q?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  cuisine?: string;
  priceLevel?: number;
  allergens?: string[];
  limit?: number;
}

export interface EdgeRestaurant {
  id: string;
  place_id: string;
  name: string;
  formatted_address?: string;
  latitude: number;
  longitude: number;
  primary_type?: string;
  place_types?: string[];
  cuisine_types?: string[];
  rating?: number;
  price_level?: number;
  phone_number?: string;
  website?: string;
  photo_references?: string[];
  is_open_now?: boolean;
  opening_hours?: any;
  has_supply_chain_data?: boolean;
  distance_meters?: number;
}

export interface SearchResponse {
  results: EdgeRestaurant[];
  count: number;
  query: SearchParams;
}

/**
 * @deprecated Direct Edge API access is discouraged for feature code.
 * Use DataAccessLayer which provides:
 * - 3-tier caching (Memory → IndexedDB → Supabase)
 * - Automatic mock fallback
 * - Standardized error handling
 * - Type-safe Location returns
 */
export class EdgeAPIClient {
  private edgeURL = import.meta.env.PROD 
    ? 'https://nutrimap-api.your-username.workers.dev' // TODO: Replace with your Worker URL
    : 'http://localhost:8787';

  /**
   * Search restaurants via Edge API (READ from Turso)
   */
  async searchRestaurants(params: SearchParams): Promise<SearchResponse> {
    const url = new URL(`${this.edgeURL}/api/restaurants/search`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Update restaurant (WRITE to Supabase)
   * Supabase webhook will sync to Turso automatically
   */
  async updateRestaurant(id: string, updates: {
    name?: string;
    formatted_address?: string;
    rating?: number;
    price_level?: number;
    phone_number?: string;
    website?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('cached_places')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  }

  /**
   * Accept disclaimer (WRITE to Edge for fast global writes)
   */
  async acceptDisclaimer(
    type: 'allergen_view' | 'supply_chain_view',
    version: string
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${this.edgeURL}/api/disclaimer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        disclaimer_type: type,
        disclaimer_version: version,
        page_url: window.location.href
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to record disclaimer acceptance');
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; edge_location: string }> {
    const response = await fetch(`${this.edgeURL}/health`);
    return response.json();
  }
}

// Singleton instance for convenience
export const edgeAPI = new EdgeAPIClient();
