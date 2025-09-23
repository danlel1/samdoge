// service-worker.js — SamDoge PWA
const CACHE = 'sdm-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/smd/logo.png',
  '/assets/smd/banner.png',
  '/assets/smd/banniere.png',
  '/assets/smd/android-chrome-192x192.png',
  '/assets/smd/android-chrome-512x512.png',
  '/assets/smd/apple-touch-icon.png',
  '/assets/smd/favicon-32x32.png',
  '/assets/smd/site.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return (
        resp ||
        fetch(event.request).then((response) => {
          const copy = response.clone();
          caches
            .open(CACHE)
            .then((cache) => cache.put(event.request, copy))
            .catch(() => {});
          return response;
        }).catch(() => resp)
      );
    })
  );
});
