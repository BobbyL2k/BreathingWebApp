const CACHE_NAME = 'breathing-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
  // If you have additional assets like CSS, JS, or images, add them here.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache falling back to network strategy.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached asset if available, else fetch from network.
        return response || fetch(event.request);
      })
  );
});

// Optionally, add an activate event to clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (!cacheWhitelist.includes(key)) {
          return caches.delete(key);
        }
      }))
    )
  );
});
