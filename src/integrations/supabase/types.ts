export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      allergen_types: {
        Row: {
          common_aliases: string[] | null
          created_at: string | null
          description: string | null
          i18n_key: string | null
          id: string
          name: string
          severity_level: string | null
          updated_at: string | null
        }
        Insert: {
          common_aliases?: string[] | null
          created_at?: string | null
          description?: string | null
          i18n_key?: string | null
          id?: string
          name: string
          severity_level?: string | null
          updated_at?: string | null
        }
        Update: {
          common_aliases?: string[] | null
          created_at?: string | null
          description?: string | null
          i18n_key?: string | null
          id?: string
          name?: string
          severity_level?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      api_quota_tracking: {
        Row: {
          burst_limit: number | null
          created_at: string | null
          id: string
          quota_limit: number
          quota_period: string
          quota_reset_at: string
          quota_used: number | null
          rate_limit_window_seconds: number | null
          service_name: string
          updated_at: string | null
        }
        Insert: {
          burst_limit?: number | null
          created_at?: string | null
          id?: string
          quota_limit: number
          quota_period: string
          quota_reset_at: string
          quota_used?: number | null
          rate_limit_window_seconds?: number | null
          service_name: string
          updated_at?: string | null
        }
        Update: {
          burst_limit?: number | null
          created_at?: string | null
          id?: string
          quota_limit?: number
          quota_period?: string
          quota_reset_at?: string
          quota_used?: number | null
          rate_limit_window_seconds?: number | null
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cache_statistics: {
        Row: {
          api_calls_saved: number
          cache_hits: number
          cache_misses: number
          date: string
          id: string
          total_places_cached: number
        }
        Insert: {
          api_calls_saved?: number
          cache_hits?: number
          cache_misses?: number
          date?: string
          id?: string
          total_places_cached?: number
        }
        Update: {
          api_calls_saved?: number
          cache_hits?: number
          cache_misses?: number
          date?: string
          id?: string
          total_places_cached?: number
        }
        Relationships: []
      }
      cached_places: {
        Row: {
          api_calls_count: number
          custom_notes: string | null
          expires_at: string | null
          first_cached_at: string
          formatted_address: string | null
          freshness_status: Database["public"]["Enums"]["freshness_status"]
          google_api_calls_used: number | null
          id: string
          is_open_now: boolean | null
          last_api_call_at: string | null
          last_updated_at: string
          last_verified_at: string | null
          latitude: number
          location: unknown | null
          longitude: number
          name: string
          opening_hours: Json | null
          phone_number: string | null
          photo_references: string[] | null
          place_id: string
          place_types: string[] | null
          price_level: number | null
          primary_type: Database["public"]["Enums"]["primary_type"]
          rating: number | null
          raw_google_data: Json | null
          refresh_interval_hours: number | null
          refresh_priority: number | null
          search_vector: unknown | null
          website: string | null
        }
        Insert: {
          api_calls_count?: number
          custom_notes?: string | null
          expires_at?: string | null
          first_cached_at?: string
          formatted_address?: string | null
          freshness_status?: Database["public"]["Enums"]["freshness_status"]
          google_api_calls_used?: number | null
          id?: string
          is_open_now?: boolean | null
          last_api_call_at?: string | null
          last_updated_at?: string
          last_verified_at?: string | null
          latitude: number
          location?: unknown | null
          longitude: number
          name: string
          opening_hours?: Json | null
          phone_number?: string | null
          photo_references?: string[] | null
          place_id: string
          place_types?: string[] | null
          price_level?: number | null
          primary_type: Database["public"]["Enums"]["primary_type"]
          rating?: number | null
          raw_google_data?: Json | null
          refresh_interval_hours?: number | null
          refresh_priority?: number | null
          search_vector?: unknown | null
          website?: string | null
        }
        Update: {
          api_calls_count?: number
          custom_notes?: string | null
          expires_at?: string | null
          first_cached_at?: string
          formatted_address?: string | null
          freshness_status?: Database["public"]["Enums"]["freshness_status"]
          google_api_calls_used?: number | null
          id?: string
          is_open_now?: boolean | null
          last_api_call_at?: string | null
          last_updated_at?: string
          last_verified_at?: string | null
          latitude?: number
          location?: unknown | null
          longitude?: number
          name?: string
          opening_hours?: Json | null
          phone_number?: string | null
          photo_references?: string[] | null
          place_id?: string
          place_types?: string[] | null
          price_level?: number | null
          primary_type?: Database["public"]["Enums"]["primary_type"]
          rating?: number | null
          raw_google_data?: Json | null
          refresh_interval_hours?: number | null
          refresh_priority?: number | null
          search_vector?: unknown | null
          website?: string | null
        }
        Relationships: []
      }
      dietary_restriction_types: {
        Row: {
          created_at: string
          description: string | null
          excluded_allergens: string[] | null
          excluded_ingredients: string[] | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          excluded_allergens?: string[] | null
          excluded_ingredients?: string[] | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          excluded_allergens?: string[] | null
          excluded_ingredients?: string[] | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      dietary_tag_types: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          i18n_key: string | null
          icon_name: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          i18n_key?: string | null
          icon_name?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          i18n_key?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      master_ingredients: {
        Row: {
          allergen_ids: string[] | null
          category: string
          common_names: string[] | null
          created_at: string | null
          description: string | null
          external_api_ids: Json | null
          id: string
          is_organic_available: boolean | null
          is_seasonal: boolean | null
          name: string
          nutritional_data: Json | null
          peak_season_months: number[] | null
          updated_at: string | null
        }
        Insert: {
          allergen_ids?: string[] | null
          category: string
          common_names?: string[] | null
          created_at?: string | null
          description?: string | null
          external_api_ids?: Json | null
          id?: string
          is_organic_available?: boolean | null
          is_seasonal?: boolean | null
          name: string
          nutritional_data?: Json | null
          peak_season_months?: number[] | null
          updated_at?: string | null
        }
        Update: {
          allergen_ids?: string[] | null
          category?: string
          common_names?: string[] | null
          created_at?: string | null
          description?: string | null
          external_api_ids?: Json | null
          id?: string
          is_organic_available?: boolean | null
          is_seasonal?: boolean | null
          name?: string
          nutritional_data?: Json | null
          peak_season_months?: number[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nutrition_goal_types: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          target_type: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          target_type?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          target_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          dietary_restrictions: string[] | null
          display_name: string | null
          first_name: string | null
          id: string
          last_name: string | null
          location: unknown | null
          location_address: string | null
          notification_email: boolean | null
          notification_marketing: boolean | null
          notification_push: boolean | null
          nutrition_goals: string[] | null
          onboarding_completed: boolean | null
          phone: string | null
          privacy_public_profile: boolean | null
          privacy_share_location: boolean | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          dietary_restrictions?: string[] | null
          display_name?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          location?: unknown | null
          location_address?: string | null
          notification_email?: boolean | null
          notification_marketing?: boolean | null
          notification_push?: boolean | null
          nutrition_goals?: string[] | null
          onboarding_completed?: boolean | null
          phone?: string | null
          privacy_public_profile?: boolean | null
          privacy_share_location?: boolean | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          dietary_restrictions?: string[] | null
          display_name?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: unknown | null
          location_address?: string | null
          notification_email?: boolean | null
          notification_marketing?: boolean | null
          notification_push?: boolean | null
          nutrition_goals?: string[] | null
          onboarding_completed?: boolean | null
          phone?: string | null
          privacy_public_profile?: boolean | null
          privacy_share_location?: boolean | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string
          business_email: string | null
          business_license: string | null
          business_name: string
          business_phone: string | null
          city: string
          created_at: string | null
          cuisine_type: string[] | null
          description: string | null
          id: string
          operating_hours: Json | null
          owner_id: string | null
          state: string
          updated_at: string | null
          verification_documents: string[] | null
          verification_status: string | null
          website: string | null
          zip_code: string
        }
        Insert: {
          address: string
          business_email?: string | null
          business_license?: string | null
          business_name: string
          business_phone?: string | null
          city: string
          created_at?: string | null
          cuisine_type?: string[] | null
          description?: string | null
          id?: string
          operating_hours?: Json | null
          owner_id?: string | null
          state: string
          updated_at?: string | null
          verification_documents?: string[] | null
          verification_status?: string | null
          website?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          business_email?: string | null
          business_license?: string | null
          business_name?: string
          business_phone?: string | null
          city?: string
          created_at?: string | null
          cuisine_type?: string[] | null
          description?: string | null
          id?: string
          operating_hours?: Json | null
          owner_id?: string | null
          state?: string
          updated_at?: string | null
          verification_documents?: string[] | null
          verification_status?: string | null
          website?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_areas: {
        Row: {
          center_latitude: number
          center_location: unknown | null
          center_longitude: number
          id: string
          is_active: boolean
          last_populated_at: string | null
          name: string
          priority: number
          radius_meters: number
        }
        Insert: {
          center_latitude: number
          center_location?: unknown | null
          center_longitude: number
          id?: string
          is_active?: boolean
          last_populated_at?: string | null
          name: string
          priority?: number
          radius_meters?: number
        }
        Update: {
          center_latitude?: number
          center_location?: unknown | null
          center_longitude?: number
          id?: string
          is_active?: boolean
          last_populated_at?: string | null
          name?: string
          priority?: number
          radius_meters?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          approved: boolean | null
          approved_at: string | null
          approved_by: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_profile_completion: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args:
          | {
              action_type: string
              max_attempts?: number
              user_id: string
              window_minutes?: number
            }
          | {
              identifier: string
              max_requests?: number
              window_seconds?: number
            }
        Returns: boolean
      }
      cleanup_old_audit_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      expire_stale_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      find_places_within_radius: {
        Args: {
          limit_count?: number
          place_type_filter?: Database["public"]["Enums"]["place_type"]
          radius_meters?: number
          search_lat: number
          search_lng: number
        }
        Returns: {
          distance_meters: number
          formatted_address: string
          is_open_now: boolean
          latitude: number
          longitude: number
          name: string
          place_id: string
          price_level: number
          primary_type: Database["public"]["Enums"]["place_type"]
          rating: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_api_quota: {
        Args: { p_amount?: number; p_service_name: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      log_login_attempt: {
        Args: {
          email: string
          ip_address?: unknown
          success: boolean
          user_agent?: string
        }
        Returns: undefined
      }
      secure_profile_update: {
        Args: { profile_id: string; update_data: Json }
        Returns: boolean
      }
      update_cache_stats: {
        Args: { hits?: number; misses?: number; saved?: number }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "customer" | "restaurant_owner" | "moderator" | "admin"
      freshness_status: "fresh" | "stale" | "expired"
      place_type:
        | "restaurant"
        | "grocery_store"
        | "convenience_store"
        | "gas_station"
        | "pharmacy"
        | "shopping_mall"
        | "other"
      primary_type:
        | "restaurant"
        | "grocery_store"
        | "supermarket"
        | "convenience_store"
        | "meal_takeaway"
        | "meal_delivery"
        | "food"
        | "store"
        | "bakery"
        | "cafe"
        | "bar"
        | "night_club"
        | "shopping_mall"
        | "farmers_market"
        | "health_food_store"
        | "organic_store"
      user_type: "customer" | "restaurant_owner" | "admin"
    }
    CompositeTypes: {
      location_data: {
        latitude: number | null
        longitude: number | null
        geometry: unknown | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "restaurant_owner", "moderator", "admin"],
      freshness_status: ["fresh", "stale", "expired"],
      place_type: [
        "restaurant",
        "grocery_store",
        "convenience_store",
        "gas_station",
        "pharmacy",
        "shopping_mall",
        "other",
      ],
      primary_type: [
        "restaurant",
        "grocery_store",
        "supermarket",
        "convenience_store",
        "meal_takeaway",
        "meal_delivery",
        "food",
        "store",
        "bakery",
        "cafe",
        "bar",
        "night_club",
        "shopping_mall",
        "farmers_market",
        "health_food_store",
        "organic_store",
      ],
      user_type: ["customer", "restaurant_owner", "admin"],
    },
  },
} as const
