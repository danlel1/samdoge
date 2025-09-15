const CACHE = 'samdoge-v1';
const ASSETS = [
  '/', '/index.html', '/banniere.jpg', '/logo.png',
  '/favicon.ico', '/favicon-32x32.png', '/favicon-16x16.png',
  '/apple-touch-icon.png', '/site.webmanifest', '/social-card.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// HTML: network-first ; autres: cache-first
self.addEventListener('fetch', e => {
  const req = e.request;
  const isHTML = req.headers.get('accept')?.includes('text/html');
  if (isHTML) {
    e.respondWith(
      fetch(req).then(res => {
        caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
  } else {
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => {
        caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }))
    );
  }
});
