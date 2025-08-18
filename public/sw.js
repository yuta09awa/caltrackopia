// Service Worker for PWA functionality
const CACHE_NAME = 'foodtome-v1';
const STATIC_CACHE_NAME = 'static-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-v2';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/offline.html'
];

// API endpoints to cache with strategies
const API_CACHE_PATTERNS = [
  { pattern: /\/api\/places/, strategy: 'networkFirst' },
  { pattern: /\/api\/restaurants/, strategy: 'cacheFirst' },
  { pattern: /\/functions\//, strategy: 'networkFirst' }
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME;
            })
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests with specific strategies
  const apiPattern = API_CACHE_PATTERNS.find(pattern => 
    pattern.pattern.test(url.pathname)
  );

  if (apiPattern) {
    event.respondWith(handleApiRequest(request, apiPattern.strategy));
    return;
  }

  // Handle static assets
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: network first with cache fallback
  event.respondWith(networkFirstWithCacheFallback(request));
});

// Network first strategy for API calls
async function handleApiRequest(request, strategy) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);

  if (strategy === 'networkFirst') {
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Clone and cache the response
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      console.log('Network failed, trying cache:', request.url);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return offline response for API calls
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'This data is not available offline' 
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } else if (strategy === 'cacheFirst') {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      fetch(request)
        .then(response => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
        })
        .catch(() => {
          // Ignore network errors for background updates
        });
      
      return cachedResponse;
    }
    
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'This data is not available offline' 
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
}

// Cache first for static assets
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Failed to fetch static asset:', request.url);
    throw error;
  }
}

// Handle navigation with offline fallback
async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('Navigation failed, showing offline page');
    
    const cache = await caches.open(STATIC_CACHE_NAME);
    const offlinePage = await cache.match('/offline.html');
    
    return offlinePage || new Response(
      'You are offline. Please check your internet connection.',
      { 
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      }
    );
  }
}

// Network first with cache fallback
async function networkFirstWithCacheFallback(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'offline-actions') {
    event.waitUntil(processOfflineActions());
  }
});

async function processOfflineActions() {
  // Process any queued offline actions
  // This would typically read from IndexedDB and sync with server
  console.log('Processing offline actions');
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push notification handling (for future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: data.data,
      actions: data.actions
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action) {
    // Handle action button clicks
    console.log('Notification action clicked:', event.action);
  } else {
    // Handle notification click
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/')
    );
  }
});