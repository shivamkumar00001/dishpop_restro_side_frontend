/**
 * Service Worker for Offline-First Restaurant Billing
 * Handles caching and offline functionality
 * Hardened with extra safety checks (non-breaking)
 */

const CACHE_NAME = 'dishpop-billing-v1';
const RUNTIME_CACHE = 'dishpop-runtime-v1';

// Files to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
];

/**
 * Allow only http(s) requests
 */
function isCacheableRequest(request) {
  return (
    request.url.startsWith('http://') ||
    request.url.startsWith('https://')
  );
}

/**
 * Extra scheme safety (chrome-extension, ws, blob, etc.)
 */
function isUnsupportedScheme(url) {
  return (
    url.protocol === 'chrome-extension:' ||
    url.protocol === 'devtools:' ||
    url.protocol === 'blob:' ||
    url.protocol === 'ws:' ||
    url.protocol === 'wss:'
  );
}

// Patterns to exclude from caching
const EXCLUDE_PATTERNS = [
  /\/api\/auth\//,
  /\/api\/.*\/login/,
  /\/api\/.*\/register/,
  /\/api\/.*\/logout/,
  /\/api\/.*\/refresh/,
  /socket\.io/,
];

// API endpoints that should use network-first strategy
const API_PATTERNS = [
  /\/api\/.*\/bills/,
  /\/api\/.*\/menu/,
  /\/api\/.*\/orders/,
  /\/api\/.*\/sessions/,
];

function shouldExclude(url) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(url));
}

function isAPICall(url) {
  return API_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * INSTALL
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Install failed:', err))
  );
});

/**
 * ACTIVATE
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then(names =>
        Promise.all(
          names.map(name => {
            if (name !== CACHE_NAME && name !== RUNTIME_CACHE) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

/**
 * FETCH
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip non-http(s)
  if (!isCacheableRequest(request)) return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Skip unsupported schemes
  if (isUnsupportedScheme(url)) return;

  // Skip excluded URLs
  if (shouldExclude(url.href)) return;

  // API → network first
  if (isAPICall(url.href)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static → cache first
  event.respondWith(cacheFirstStrategy(request));
});

/**
 * NETWORK FIRST (API)
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);

    if (
      response &&
      response.status === 200 &&
      response.type !== 'opaque'
    ) {
      try {
        await cache.put(request, response.clone());
      } catch (e) {
        console.warn('[SW] Cache put failed:', request.url);
      }
    }

    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    return new Response(
      JSON.stringify({
        success: false,
        offline: true,
        message: 'Offline – network unavailable',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * CACHE FIRST (STATIC)
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);

  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);

    if (
      response &&
      response.status === 200 &&
      response.type !== 'opaque'
    ) {
      try {
        await cache.put(request, response.clone());
      } catch (e) {
        console.warn('[SW] Cache put failed:', request.url);
      }
    }

    return response;
  } catch {
    if (request.mode === 'navigate') {
      const offline = await cache.match('/offline.html');
      if (offline) return offline;
    }

    return new Response('Offline', { status: 503 });
  }
}

/**
 * BACKGROUND SYNC
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bills') {
    event.waitUntil(
      self.clients.matchAll().then(clients =>
        clients.forEach(client =>
          client.postMessage({ type: 'BACKGROUND_SYNC' })
        )
      )
    );
  }
});

/**
 * MESSAGE
 */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CLIENTS_CLAIM') self.clients.claim();
});

console.log('[SW] Service Worker loaded safely');
