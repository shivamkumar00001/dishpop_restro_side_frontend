/**
 * Service Worker for Offline-First Restaurant Billing
 * Handles caching and offline functionality
 * Updated to exclude auth endpoints and handle API properly
 */

const CACHE_NAME = 'dishpop-billing-v1';
const RUNTIME_CACHE = 'dishpop-runtime-v1';

// Files to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
];

// Patterns to exclude from caching
const EXCLUDE_PATTERNS = [
  /\/api\/auth\//, // All auth endpoints
  /\/api\/.*\/login/, // Login endpoints
  /\/api\/.*\/register/, // Register endpoints
  /\/api\/.*\/logout/, // Logout endpoints
  /\/api\/.*\/refresh/, // Token refresh endpoints
  /socket\.io/, // Socket.io connections
];

// API endpoints that should use network-first strategy
const API_PATTERNS = [
  /\/api\/.*\/bills/,
  /\/api\/.*\/menu/,
  /\/api\/.*\/orders/,
  /\/api\/.*\/sessions/,
];

/**
 * Check if URL should be excluded from caching
 */
function shouldExclude(url) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * Check if URL is an API call
 */
function isAPICall(url) {
  return API_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * Install event - cache essential files
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Service worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - handle requests with appropriate strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip excluded URLs (auth, websockets, etc.)
  if (shouldExclude(url.href)) {
    console.log('[SW] Skipping excluded URL:', url.pathname);
    return;
  }

  // Handle API calls with network-first strategy
  if (isAPICall(url.href)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(cacheFirstStrategy(request));
});

/**
 * Network-first strategy for API calls
 * Try network first, fallback to cache if offline
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[SW] Network request failed, trying cache:', request.url);
    
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }

    // No cache available, return offline response
    console.log('[SW] No cache available for:', request.url);
    
    // Return a JSON response indicating offline mode for API calls
    return new Response(
      JSON.stringify({
        success: false,
        offline: true,
        message: 'This request failed because you are offline',
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}

/**
 * Cache-first strategy for static assets
 * Try cache first, fallback to network
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  // Cache miss, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the response for future use
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network and cache failed for:', request.url);
    
    // For navigation requests, show offline page
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }

    // Return a basic offline response
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

/**
 * Background sync event
 * Sync data when connection is restored
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-bills') {
    event.waitUntil(
      // Send message to clients to trigger sync
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'BACKGROUND_SYNC',
            tag: event.tag,
          });
        });
      })
    );
  }
});

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLIENTS_CLAIM') {
    self.clients.claim();
  }
});

console.log('[SW] Service Worker loaded');