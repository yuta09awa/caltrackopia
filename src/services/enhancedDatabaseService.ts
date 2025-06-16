
import { supabase } from '@/integrations/supabase/client';
import { DatabaseError, NetworkError } from './errors/DatabaseError';
import {
  AllergenType,
  DietaryTagType,
  MasterIngredient,
  ApiQuotaTracking,
  AuditLog,
  EnhancedPlaceWithTTL,
  QuotaStatus,
  QuotaCheckResult,
  AuditLogEntry
} from '@/models/StandardizedData';

export class EnhancedDatabaseService {
  // Allergen Types Management
  async getAllergenTypes(): Promise<AllergenType[]> {
    try {
      const { data, error } = await supabase
        .from('allergen_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching allergen types:', error);
        throw new DatabaseError(`Failed to fetch allergen types: ${error.message}`, 'ALLERGEN_FETCH_ERROR', error);
      }

      return (data || []).map(this.transformAllergenType);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching allergen types:', error);
      throw new NetworkError('Network error while fetching allergen types');
    }
  }

  async getAllergenTypeById(id: string): Promise<AllergenType | null> {
    try {
      const { data, error } = await supabase
        .from('allergen_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        console.error('Error fetching allergen type:', error);
        throw new DatabaseError(`Failed to fetch allergen type: ${error.message}`, 'ALLERGEN_FETCH_ERROR', error);
      }

      return this.transformAllergenType(data);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching allergen type:', error);
      throw new NetworkError('Network error while fetching allergen type');
    }
  }

  // Dietary Tag Types Management
  async getDietaryTagTypes(): Promise<DietaryTagType[]> {
    try {
      const { data, error } = await supabase
        .from('dietary_tag_types')
        .select('*')
        .order('category, name');

      if (error) {
        console.error('Error fetching dietary tag types:', error);
        throw new DatabaseError(`Failed to fetch dietary tag types: ${error.message}`, 'DIETARY_TAG_FETCH_ERROR', error);
      }

      return (data || []).map(this.transformDietaryTagType);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching dietary tag types:', error);
      throw new NetworkError('Network error while fetching dietary tag types');
    }
  }

  async getDietaryTagTypesByCategory(category: string): Promise<DietaryTagType[]> {
    try {
      const { data, error } = await supabase
        .from('dietary_tag_types')
        .select('*')
        .eq('category', category)
        .order('name');

      if (error) {
        console.error('Error fetching dietary tag types by category:', error);
        throw new DatabaseError(`Failed to fetch dietary tag types: ${error.message}`, 'DIETARY_TAG_FETCH_ERROR', error);
      }

      return (data || []).map(this.transformDietaryTagType);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching dietary tag types by category:', error);
      throw new NetworkError('Network error while fetching dietary tag types by category');
    }
  }

  // Master Ingredients Management
  async getMasterIngredients(): Promise<MasterIngredient[]> {
    try {
      const { data, error } = await supabase
        .from('master_ingredients')
        .select('*')
        .order('category, name');

      if (error) {
        console.error('Error fetching master ingredients:', error);
        throw new DatabaseError(`Failed to fetch master ingredients: ${error.message}`, 'INGREDIENT_FETCH_ERROR', error);
      }

      return (data || []).map(this.transformMasterIngredient);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching master ingredients:', error);
      throw new NetworkError('Network error while fetching master ingredients');
    }
  }

  async searchMasterIngredients(query: string, limit: number = 20): Promise<MasterIngredient[]> {
    try {
      const { data, error } = await supabase
        .from('master_ingredients')
        .select('*')
        .or(`name.ilike.%${query}%, common_names.cs.{${query}}`)
        .limit(limit);

      if (error) {
        console.error('Error searching master ingredients:', error);
        throw new DatabaseError(`Failed to search master ingredients: ${error.message}`, 'INGREDIENT_SEARCH_ERROR', error);
      }

      return (data || []).map(this.transformMasterIngredient);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error searching master ingredients:', error);
      throw new NetworkError('Network error while searching master ingredients');
    }
  }

  async getMasterIngredientsByCategory(category: string): Promise<MasterIngredient[]> {
    try {
      const { data, error } = await supabase
        .from('master_ingredients')
        .select('*')
        .eq('category', category)
        .order('name');

      if (error) {
        console.error('Error fetching master ingredients by category:', error);
        throw new DatabaseError(`Failed to fetch master ingredients: ${error.message}`, 'INGREDIENT_FETCH_ERROR', error);
      }

      return (data || []).map(this.transformMasterIngredient);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching master ingredients by category:', error);
      throw new NetworkError('Network error while fetching master ingredients by category');
    }
  }

  // Enhanced Cached Places with TTL
  async getCachedPlacesWithTTL(): Promise<EnhancedPlaceWithTTL[]> {
    try {
      const { data, error } = await supabase
        .from('cached_places')
        .select('*')
        .order('refresh_priority', { ascending: false });

      if (error) {
        console.error('Error fetching cached places with TTL:', error);
        throw new DatabaseError(`Failed to fetch cached places: ${error.message}`, 'PLACE_FETCH_ERROR', error);
      }

      return (data || []).map(this.transformEnhancedPlaceWithTTL);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching cached places with TTL:', error);
      throw new NetworkError('Network error while fetching cached places with TTL');
    }
  }

  async getExpiredCachedPlaces(): Promise<EnhancedPlaceWithTTL[]> {
    try {
      const { data, error } = await supabase
        .from('cached_places')
        .select('*')
        .lt('expires_at', new Date().toISOString())
        .order('refresh_priority', { ascending: false });

      if (error) {
        console.error('Error fetching expired cached places:', error);
        throw new DatabaseError(`Failed to fetch expired places: ${error.message}`, 'PLACE_FETCH_ERROR', error);
      }

      return (data || []).map(this.transformEnhancedPlaceWithTTL);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching expired cached places:', error);
      throw new NetworkError('Network error while fetching expired cached places');
    }
  }

  async updatePlaceTTL(placeId: string, refreshIntervalHours: number = 24): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + refreshIntervalHours);

      const { error } = await supabase
        .from('cached_places')
        .update({
          expires_at: expiresAt.toISOString(),
          refresh_interval_hours: refreshIntervalHours,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', placeId);

      if (error) {
        console.error('Error updating place TTL:', error);
        throw new DatabaseError(`Failed to update place TTL: ${error.message}`, 'PLACE_UPDATE_ERROR', error);
      }
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error updating place TTL:', error);
      throw new NetworkError('Network error while updating place TTL');
    }
  }

  // API Quota Management
  async checkApiQuota(serviceName: string): Promise<QuotaCheckResult> {
    try {
      const { data, error } = await supabase
        .from('api_quota_tracking')
        .select('*')
        .eq('service_name', serviceName)
        .eq('quota_period', 'daily')
        .gte('quota_reset_at', new Date().toISOString())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking API quota:', error);
        throw new DatabaseError(`Failed to check API quota: ${error.message}`, 'QUOTA_CHECK_ERROR', error);
      }

      if (!data) {
        // No quota record found, assume allowed
        return {
          allowed: true,
          quotaStatus: {
            serviceName,
            quotaUsed: 0,
            quotaLimit: 1000, // Default limit
            quotaRemaining: 1000,
            resetAt: new Date().toISOString(),
            isExceeded: false
          }
        };
      }

      const quotaStatus: QuotaStatus = {
        serviceName: data.service_name,
        quotaUsed: data.quota_used,
        quotaLimit: data.quota_limit,
        quotaRemaining: data.quota_limit - data.quota_used,
        resetAt: data.quota_reset_at,
        isExceeded: data.quota_used >= data.quota_limit,
        burstAvailable: data.burst_limit ? Math.max(0, data.burst_limit - data.quota_used) : undefined
      };

      return {
        allowed: !quotaStatus.isExceeded,
        quotaStatus
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error checking API quota:', error);
      throw new NetworkError('Network error while checking API quota');
    }
  }

  async incrementApiQuota(serviceName: string, amount: number = 1): Promise<void> {
    try {
      // Use direct SQL update instead of RPC to avoid TypeScript issues
      const { error } = await supabase
        .from('api_quota_tracking')
        .update({
          quota_used: supabase.sql`quota_used + ${amount}`,
          updated_at: new Date().toISOString()
        })
        .eq('service_name', serviceName)
        .eq('quota_period', 'daily')
        .gte('quota_reset_at', new Date().toISOString());

      if (error) {
        console.error('Error incrementing API quota:', error);
        throw new DatabaseError(`Failed to increment API quota: ${error.message}`, 'QUOTA_INCREMENT_ERROR', error);
      }
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error incrementing API quota:', error);
      throw new NetworkError('Network error while incrementing API quota');
    }
  }

  // Audit Logging
  async logAuditEvent(entry: AuditLogEntry): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          action_type: entry.actionType,
          table_name: entry.tableName,
          record_id: entry.recordId,
          old_values: entry.oldValues,
          new_values: entry.newValues,
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error logging audit event:', error);
        // Don't throw here - audit logging shouldn't break the main flow
      }
    } catch (error) {
      console.error('Unexpected error logging audit event:', error);
      // Don't throw here - audit logging shouldn't break the main flow
    }
  }

  async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching audit logs:', error);
        throw new DatabaseError(`Failed to fetch audit logs: ${error.message}`, 'AUDIT_FETCH_ERROR', error);
      }

      return (data || []).map(this.transformAuditLog);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      console.error('Unexpected error fetching audit logs:', error);
      throw new NetworkError('Network error while fetching audit logs');
    }
  }

  // Transform methods
  private transformAllergenType(data: any): AllergenType {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      commonAliases: data.common_aliases || [],
      severityLevel: data.severity_level,
      i18nKey: data.i18n_key,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformDietaryTagType(data: any): DietaryTagType {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      iconName: data.icon_name,
      i18nKey: data.i18n_key,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformMasterIngredient(data: any): MasterIngredient {
    return {
      id: data.id,
      name: data.name,
      commonNames: data.common_names || [],
      category: data.category,
      description: data.description,
      nutritionalData: data.nutritional_data,
      allergenIds: data.allergen_ids || [],
      isOrganicAvailable: data.is_organic_available,
      isSeasonal: data.is_seasonal,
      peakSeasonMonths: data.peak_season_months,
      externalApiIds: data.external_api_ids,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private transformEnhancedPlaceWithTTL(data: any): EnhancedPlaceWithTTL {
    return {
      id: data.id,
      place_id: data.place_id,
      name: data.name,
      formatted_address: data.formatted_address,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      place_types: data.place_types || [],
      primary_type: data.primary_type,
      secondary_type: data.secondary_type,
      google_primary_type: data.google_primary_type,
      rating: data.rating ? parseFloat(data.rating) : undefined,
      price_level: data.price_level,
      phone_number: data.phone_number,
      website: data.website,
      opening_hours: data.opening_hours,
      is_open_now: data.is_open_now,
      timezone: data.timezone,
      photo_references: data.photo_references || [],
      first_cached_at: data.first_cached_at,
      last_updated_at: data.last_updated_at,
      freshness_status: data.freshness_status,
      quality_score: data.quality_score || 5,
      verification_count: data.verification_count || 0,
      data_source: data.data_source || 'google_places',
      expires_at: data.expires_at,
      refresh_interval_hours: data.refresh_interval_hours || 24,
      refresh_priority: data.refresh_priority || 1,
      google_api_calls_used: data.google_api_calls_used || 0,
      last_api_call_at: data.last_api_call_at
    };
  }

  private transformAuditLog(data: any): AuditLog {
    return {
      id: data.id,
      userId: data.user_id,
      actionType: data.action_type,
      tableName: data.table_name,
      recordId: data.record_id,
      oldValues: data.old_values,
      newValues: data.new_values,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      createdAt: data.created_at
    };
  }
}

export const enhancedDatabaseService = new EnhancedDatabaseService();
