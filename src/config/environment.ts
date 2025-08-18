export const environment = {
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'FoodToMe',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appDomain: import.meta.env.VITE_APP_DOMAIN || 'foodtome.app',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  
  // Supabase
  supabaseUrl: 'https://aulfiflberencgsdvyay.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bGZpZmxiZXJlbmNnc2R2eWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjM1NjAsImV4cCI6MjA2NDEzOTU2MH0.r5KVeORNXx95s8BGpJCQrGKmUu5hHsyembSQJsgh8qQ',
  
  // Google Maps
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  
  // API Configuration
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  
  // Analytics & Monitoring
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  
  // Feature Flags
  enableDevelopmentTools: import.meta.env.VITE_ENABLE_DEVELOPMENT_TOOLS === 'true',
  enableLocationSpoofing: import.meta.env.VITE_ENABLE_LOCATION_SPOOFING === 'true',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  
  // Rate Limiting
  rateLimitRequests: parseInt(import.meta.env.VITE_API_RATE_LIMIT_REQUESTS || '100'),
  rateLimitWindow: parseInt(import.meta.env.VITE_API_RATE_LIMIT_WINDOW || '60000'),
} as const;

// Validation
export const validateEnvironment = () => {
  const required = [
    'supabaseUrl',
    'supabaseAnonKey',
  ] as const;
  
  const missing = required.filter(key => !environment[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (environment.isProduction) {
    const productionRequired = [
      'googleMapsApiKey',
    ] as const;
    
    const missingProduction = productionRequired.filter(key => !environment[key]);
    
    if (missingProduction.length > 0) {
      console.warn(`Missing production environment variables: ${missingProduction.join(', ')}`);
    }
  }
};