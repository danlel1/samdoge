self.addEventListener('install', e => {
  e.waitUntil(caches.open('smd-v1').then(c => c.addAll([
    '/', '/index.html', '/manifest.webmanifest',
    '/logo.png','/logo-192.png','/logo-512.png','/favicon.png','/og-cover.jpg'
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
