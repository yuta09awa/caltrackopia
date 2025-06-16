
// Standardized data interfaces for the new database schema

export interface AllergenType {
  id: string;
  name: string;
  description?: string;
  commonAliases: string[];
  severityLevel: 'low' | 'medium' | 'high' | 'severe';
  i18nKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface DietaryTagType {
  id: string;
  name: string;
  description?: string;
  category?: string;
  iconName?: string;
  i18nKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface MasterIngredient {
  id: string;
  name: string;
  commonNames: string[];
  category: string;
  description?: string;
  nutritionalData?: Record<string, any>;
  allergenIds: string[];
  isOrganicAvailable: boolean;
  isSeasonal: boolean;
  peakSeasonMonths?: number[];
  externalApiIds?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiQuotaTracking {
  id: string;
  serviceName: string;
  quotaPeriod: string;
  quotaLimit: number;
  quotaUsed: number;
  quotaResetAt: string;
  burstLimit?: number;
  rateLimitWindowSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  actionType: string;
  tableName?: string;
  recordId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Enhanced EnhancedPlace interface with TTL and quota tracking
export interface EnhancedPlaceWithTTL {
  id: string;
  place_id: string;
  name: string;
  formatted_address?: string;
  latitude: number;
  longitude: number;
  place_types: string[];
  primary_type: string;
  secondary_type?: string;
  google_primary_type?: string;
  rating?: number;
  price_level?: number;
  phone_number?: string;
  website?: string;
  opening_hours?: any;
  is_open_now?: boolean;
  timezone?: string;
  photo_references: string[];
  first_cached_at: string;
  last_updated_at: string;
  freshness_status: string;
  quality_score?: number;
  verification_count: number;
  data_source: string;
  // New TTL and quota fields
  expires_at?: string;
  refresh_interval_hours: number;
  refresh_priority: number;
  google_api_calls_used: number;
  last_api_call_at?: string;
}

// API Quota Management interfaces
export interface QuotaStatus {
  serviceName: string;
  quotaUsed: number;
  quotaLimit: number;
  quotaRemaining: number;
  resetAt: string;
  isExceeded: boolean;
  burstAvailable?: number;
}

export interface QuotaCheckResult {
  allowed: boolean;
  quotaStatus: QuotaStatus;
  error?: string;
}

// Audit interfaces
export interface AuditLogEntry {
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ' | 'API_CALL';
  tableName?: string;
  recordId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
}
