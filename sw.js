// sw.js — SamDoge PWA (v4)
const CACHE = 'samdoge-v4';
const ASSETS = [
  '/', '/index.html',
  '/offline.html',
  '/banniere.jpg', '/logo.png', '/social-card.png',
  '/favicon.ico', '/favicon-32x32.png', '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/site.webmanifest'
];

// Install: pré-cache
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate: supprime anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: HTML = network-first (+ offline.html), assets = cache-first
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const accept = req.headers.get('accept') || '';
  const isHTML = accept.includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(req).then(res => {
        caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() =>
        caches.match(req).then(r => r || caches.match('/offline.html'))
      )
    );
  } else {
    e.respondWith(
      caches.match(req).then(cached => {
        const fetchThenCache = fetch(req).then(res => {
          caches.open(CACHE).then(c => c.put(req, res.clone()));
          return res;
        }).catch(() => cached);
        return cached || fetchThenCache;
      })
    );
  }
});
