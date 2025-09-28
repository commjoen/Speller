// Service Worker for Speller App
const CACHE_NAME = 'speller-v1';
const STATIC_CACHE_NAME = 'speller-static-v1';
const DYNAMIC_CACHE_NAME = 'speller-dynamic-v1';

// Resources to cache for offline use
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/data.json',
  '/manifest.json',
];

// Install event - cache essential resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static resources...');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('Static resources cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(error => {
        console.error('Failed to cache static resources:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete old caches
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve(); // Return resolved promise for non-matching caches
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method !== 'GET') {
    return; // Only handle GET requests
  }

  // Handle image requests with dynamic caching
  if (request.url.includes('/images/')) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle static resources with cache-first strategy
  if (STATIC_RESOURCES.some(resource => request.url.endsWith(resource))) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(handleDynamicRequest(request));
});

// Cache-first strategy for static resources
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Serving from cache:', request.url);
      return cachedResponse;
    }

    console.log('Fetching from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache the response for future use
    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    console.error('Failed to handle static request:', error);

    // Return a fallback response for essential files
    if (request.url.endsWith('.html') || request.url.endsWith('/')) {
      return new Response(createOfflineHTML(), { headers: { 'Content-Type': 'text/html' } });
    }

    throw error;
  }
}

// Network-first strategy with cache fallback
async function handleDynamicRequest(request) {
  try {
    console.log('Fetching from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    console.error('Failed to handle dynamic request:', error);
    throw error;
  }
}

// Special handling for images with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Serving image from cache:', request.url);
      return cachedResponse;
    }

    console.log('Fetching image from network:', request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the image for future use
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Image not found');
  } catch (error) {
    console.error('Failed to load image:', request.url, error);

    // Return a fallback SVG image
    return new Response(createFallbackSVG(request.url), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'max-age=86400', // Cache fallback for 1 day
      },
    });
  }
}

// Create fallback SVG for missing images
function createFallbackSVG(imageUrl) {
  const imageName = imageUrl.split('/').pop().replace('.svg', '');
  const firstLetter = imageName.charAt(0).toUpperCase();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #f0f4f7; stroke: #667eea; stroke-width: 3; }
      .text { font-family: Arial, sans-serif; font-weight: bold; text-anchor: middle; dominant-baseline: central; fill: #333; }
    </style>
  </defs>
  <rect class="bg" x="10" y="10" width="180" height="180" rx="15"/>
  <circle cx="100" cy="80" r="30" fill="#667eea"/>
  <text x="100" y="85" class="text" style="font-size: 36px; fill: white;">${firstLetter}</text>
  <text x="100" y="170" class="text" style="font-size: 14px;">${imageName}</text>
  <text x="100" y="185" class="text" style="font-size: 10px; fill: #999;">Image unavailable</text>
</svg>`;
}

// Create offline HTML fallback
function createOfflineHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Speller - Offline</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .offline-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { margin-top: 0; }
        .retry-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 1rem;
        }
        .retry-btn:hover { background: #45a049; }
    </style>
</head>
<body>
    <div class="offline-container">
        <h1>🎮 Speller</h1>
        <h2>You're Offline</h2>
        <p>The game is not available right now, but you can try again when you're back online.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
    </div>
</body>
</html>`;
}

// Background sync for when connection is restored
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(
      // Update caches when connection is restored
      updateCaches()
    );
  }
});

// Update caches with fresh content
async function updateCaches() {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    await cache.addAll(STATIC_RESOURCES);
    console.log('Caches updated successfully');
  } catch (error) {
    console.error('Failed to update caches:', error);
  }
}

// Handle push notifications (for future features)
self.addEventListener('push', event => {
  console.log('Push notification received:', event);
  // Implementation for push notifications can be added here
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
