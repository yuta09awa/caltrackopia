/**
 * Production Configuration
 * Environment-specific settings for production deployments
 */

export const productionConfig = {
  logging: {
    level: import.meta.env.PROD ? 'info' : 'debug',
    externalService: {
      enabled: import.meta.env.PROD,
      endpoint: import.meta.env.VITE_LOG_ENDPOINT || '/api/logs',
    },
  },
  monitoring: {
    enabled: import.meta.env.PROD,
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
    },
  },
  performance: {
    trackingEnabled: true,
    slowRenderThreshold: 16, // ms
    slowApiThreshold: 3000, // ms
  },
  security: {
    rateLimit: {
      maxRequests: 100,
      windowMs: 60000, // 1 minute
    },
    inputValidation: {
      maxLength: {
        text: 1000,
        email: 255,
        url: 2048,
      },
    },
  },
  pwa: {
    updateCheckInterval: 60000, // 1 minute
    offlineQueueMaxSize: 100,
    cacheExpiry: 86400000, // 24 hours
  },
} as const;

export type ProductionConfig = typeof productionConfig;
