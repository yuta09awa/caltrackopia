/**
 * Feature Flag Service
 * Manages feature flag evaluation with support for:
 * - User-specific rollouts
 * - Regional rollouts
 * - Percentage-based gradual rollouts
 * - Memory caching for performance
 */

import { supabase } from '@/integrations/supabase/client';

export interface FeatureFlag {
  id: string;
  flag_name: string;
  enabled: boolean;
  description?: string;
  user_ids: string[];
  regions: string[];
  rollout_percentage: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

class FeatureFlagService {
  private cache: Map<string, FeatureFlag> = new Map();
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
  private lastFetch: number = 0;
  private fetchPromise: Promise<void> | null = null;

  /**
   * Check if a feature flag is enabled for a specific user
   */
  async isEnabled(
    flagName: string,
    userId?: string,
    region?: string
  ): Promise<boolean> {
    try {
      // Ensure flags are loaded
      await this.ensureFlagsLoaded();

      const flag = this.cache.get(flagName);
      
      // Flag doesn't exist or is globally disabled
      if (!flag || !flag.enabled) {
        return false;
      }

      // Check user-specific access
      if (userId && flag.user_ids.length > 0) {
        return flag.user_ids.includes(userId);
      }

      // Check region-specific access
      if (region && flag.regions.length > 0) {
        return flag.regions.includes(region);
      }

      // Check percentage-based rollout
      if (flag.rollout_percentage > 0 && flag.rollout_percentage < 100) {
        // Use consistent hash based on flag name and user ID
        const hash = this.hashString(flagName + (userId || ''));
        return (hash % 100) < flag.rollout_percentage;
      }

      // If rollout_percentage is 100, everyone gets access
      return flag.rollout_percentage === 100;
    } catch (error) {
      console.error('[FeatureFlags] Error checking flag:', flagName, error);
      // Fail open: return false on error
      return false;
    }
  }

  /**
   * Get all feature flags (for admin UI)
   */
  async getAllFlags(): Promise<FeatureFlag[]> {
    await this.ensureFlagsLoaded();
    return Array.from(this.cache.values());
  }

  /**
   * Update a feature flag (admin only)
   */
  async updateFlag(
    flagName: string,
    updates: Partial<Omit<FeatureFlag, 'id' | 'flag_name' | 'created_at' | 'updated_at' | 'created_by'>>
  ): Promise<void> {
    const { error } = await supabase
      .from('feature_flags')
      .update(updates)
      .eq('flag_name', flagName);

    if (error) {
      console.error('[FeatureFlags] Error updating flag:', error);
      throw error;
    }

    // Invalidate cache
    this.invalidateCache();
    await this.loadFlags();
  }

  /**
   * Create a new feature flag (admin only)
   */
  async createFlag(flag: Omit<FeatureFlag, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<void> {
    const { error } = await supabase
      .from('feature_flags')
      .insert({
        flag_name: flag.flag_name,
        enabled: flag.enabled,
        description: flag.description,
        user_ids: flag.user_ids,
        regions: flag.regions,
        rollout_percentage: flag.rollout_percentage
      });

    if (error) {
      console.error('[FeatureFlags] Error creating flag:', error);
      throw error;
    }

    // Invalidate cache
    this.invalidateCache();
    await this.loadFlags();
  }

  /**
   * Toggle a feature flag on/off (admin only)
   */
  async toggleFlag(flagName: string): Promise<boolean> {
    const flag = this.cache.get(flagName);
    if (!flag) {
      throw new Error(`Flag ${flagName} not found`);
    }

    const newState = !flag.enabled;
    await this.updateFlag(flagName, { enabled: newState });
    return newState;
  }

  /**
   * Invalidate the cache
   */
  invalidateCache(): void {
    this.cache.clear();
    this.lastFetch = 0;
  }

  /**
   * Ensure flags are loaded and not expired
   */
  private async ensureFlagsLoaded(): Promise<void> {
    const now = Date.now();
    
    // If cache is fresh, return immediately
    if (this.cache.size > 0 && now - this.lastFetch < this.cacheExpiry) {
      return;
    }

    // If a fetch is already in progress, wait for it
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Start a new fetch
    this.fetchPromise = this.loadFlags();
    await this.fetchPromise;
    this.fetchPromise = null;
  }

  /**
   * Load all feature flags from Supabase
   */
  private async loadFlags(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('flag_name');

      if (error) {
        console.error('[FeatureFlags] Error loading flags:', error);
        throw error;
      }

      // Update cache
      this.cache.clear();
      data?.forEach(flag => {
        this.cache.set(flag.flag_name, flag as FeatureFlag);
      });

      this.lastFetch = Date.now();
      console.log(`[FeatureFlags] Loaded ${this.cache.size} feature flags`);
    } catch (error) {
      console.error('[FeatureFlags] Failed to load flags:', error);
      // Don't throw - fail gracefully
    }
  }

  /**
   * Simple hash function for consistent percentage-based rollouts
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cachedFlags: this.cache.size,
      lastFetch: this.lastFetch,
      cacheAge: Date.now() - this.lastFetch,
      flags: Array.from(this.cache.keys())
    };
  }
}

export const featureFlagService = new FeatureFlagService();
