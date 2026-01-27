/**
 * Service Worker for Booking Widget
 * Provides offline support and caching strategies
 *
 * Cache Strategies:
 * - Static assets: Cache First (images, fonts, CSS, JS)
 * - API /classes: Stale-While-Revalidate (show cached, update in background)
 * - HTML pages: Network First (fresh content, fallback to cache)
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `booking-static-${CACHE_VERSION}`;
const API_CACHE = `booking-api-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `booking-dynamic-${CACHE_VERSION}`;

// Static assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/es/reservas',
  '/images/logo/img/logo-fidc_256.webp',
];

// API endpoints to cache with stale-while-revalidate
const API_PATTERNS = [
  /\/api\/classes/,
  /\/api\/momence/,
];

// Asset patterns for cache-first strategy
const STATIC_PATTERNS = [
  /\.(js|css|woff2?|ttf|eot)$/,
  /\/images\//,
  /\/fonts\//,
];

/**
 * Install event - precache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[SW] Precache failed for some assets:', err);
          // Continue even if some assets fail
        });
      })
      // Note: Don't call skipWaiting() here - let user control when to update
      // The useServiceWorker hook will send SKIP_WAITING message when user clicks "Update"
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
          cacheNames
            .filter((name) => {
              // Delete old version caches
              return (
                name.startsWith('booking-') &&
                name !== STATIC_CACHE &&
                name !== API_CACHE &&
                name !== DYNAMIC_CACHE
              );
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        self.clients.claim();
      })
  );
});

/**
 * Fetch event - handle requests with appropriate strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Determine strategy based on request type
  if (isApiRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isHtmlRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

/**
 * Check if request is for API endpoint
 */
function isApiRequest(url) {
  return API_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(url) {
  return STATIC_PATTERNS.some((pattern) => pattern.test(url.pathname));
}

/**
 * Check if request is for HTML page
 */
function isHtmlRequest(request) {
  return request.headers.get('Accept')?.includes('text/html');
}

/**
 * Cache First Strategy
 * Best for: Static assets (images, fonts, CSS, JS)
 * - Try cache first
 * - Fall back to network
 * - Update cache on network success
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network First Strategy
 * Best for: HTML pages (fresh content priority)
 * - Try network first
 * - Fall back to cache
 * - Update cache on network success
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network first: falling back to cache');
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Return offline page for HTML requests
    return cache.match('/') || new Response(offlineHtml(), {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

/**
 * Stale While Revalidate Strategy
 * Best for: API data (show cached immediately, update in background)
 * - Return cached response immediately if available
 * - Fetch from network in background
 * - Update cache with fresh response
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Fetch in background regardless
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch((error) => {
      console.warn('[SW] Background fetch failed:', error);
      return null;
    });

  // Return cached immediately if available
  if (cached) {
    // Notify clients that we're revalidating
    notifyClients({ type: 'REVALIDATING', url: request.url });
    return cached;
  }

  // Wait for network if no cache
  const networkResponse = await fetchPromise;

  if (networkResponse) {
    return networkResponse;
  }

  // Return error response if both fail
  return new Response(
    JSON.stringify({ error: 'Offline', cached: false }),
    {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Notify all clients about cache events
 */
async function notifyClients(message) {
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach((client) => {
    client.postMessage(message);
  });
}

/**
 * Offline HTML fallback
 */
function offlineHtml() {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sin conexión - Farray's Dance Center</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #B01E3C;
    }
    p {
      color: #888;
      max-width: 400px;
      line-height: 1.6;
    }
    button {
      margin-top: 20px;
      padding: 12px 24px;
      background: #B01E3C;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background: #8E1830;
    }
  </style>
</head>
<body>
  <div class="icon">📡</div>
  <h1>Sin conexión a Internet</h1>
  <p>
    Parece que no tienes conexión a Internet.
    Verifica tu conexión y vuelve a intentarlo.
  </p>
  <button onclick="window.location.reload()">
    Reintentar
  </button>
</body>
</html>
  `;
}

/**
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      })
    );
  }

  if (event.data.type === 'CACHE_CLASSES') {
    // Manually cache classes data
    const { url, data } = event.data;
    if (url && data) {
      caches.open(API_CACHE).then((cache) => {
        const response = new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        });
        cache.put(url, response);
      });
    }
  }
});

console.log('[SW] Service Worker loaded');
