// sw.js – Service Worker minimal pour PWA (GitHub Pages compatible)
const CACHE = 'samdoge-v1';
const ASSETS = [
  '/',            // GitHub Pages sert souvent /index.html à /
  '/index.html',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  '/logo.png',
  '/banner.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Stratégie cache-first avec fallback réseau
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
