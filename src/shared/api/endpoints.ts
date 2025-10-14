/**
 * Centralized API Endpoint Definitions
 * Single source of truth for all API endpoints
 */

export const API_ENDPOINTS = {
  // Supabase Edge Functions
  supabase: {
    functions: {
      googleMapsKey: '/functions/v1/get-google-maps-api-key',
      cacheManager: '/functions/v1/places-cache-manager',
    },
  },

  // Auth endpoints
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    session: '/auth/session',
  },

  // Profile endpoints
  profile: {
    get: (userId: string) => `/profiles/${userId}`,
    update: (userId: string) => `/profiles/${userId}`,
    uploadAvatar: (userId: string) => `/profiles/${userId}/avatar`,
    list: '/profiles',
  },

  // Locations endpoints
  locations: {
    search: '/cached-places',
    nearby: '/cached-places/nearby',
    getById: (id: string) => `/cached-places/${id}`,
    byType: (type: string) => `/cached-places/type/${type}`,
  },

  // Places/Cache endpoints
  places: {
    cached: '/cached-places',
    getById: (id: string) => `/cached-places/${id}`,
    statistics: '/cache-statistics',
  },

  // Ingredients endpoints
  ingredients: {
    search: '/ingredients/search',
    getById: (id: string) => `/ingredients/${id}`,
    byCategory: (category: string) => `/ingredients/category/${category}`,
  },

  // Nutrition endpoints
  nutrition: {
    search: '/nutrition/search',
    getById: (id: string) => `/nutrition/${id}`,
    goals: '/nutrition-goals',
  },

  // Cart endpoints (future external API)
  cart: {
    get: '/cart',
    add: '/cart/add',
    remove: '/cart/remove',
    update: '/cart/update',
    clear: '/cart/clear',
  },

  // Restaurants endpoints
  restaurants: {
    list: '/restaurants',
    getById: (id: string) => `/restaurants/${id}`,
    create: '/restaurants',
    update: (id: string) => `/restaurants/${id}`,
    delete: (id: string) => `/restaurants/${id}`,
  },

  // Markets endpoints
  markets: {
    list: '/markets',
    getById: (id: string) => `/markets/${id}`,
    nearby: '/markets/nearby',
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
