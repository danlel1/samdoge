const CACHE = 'samdoge-v1';
const ASSETS = [
  '/', '/index.html',
  '/assets/smd/banniere.jpg',
  '/assets/smd/logo.png',
  '/assets/smd/android-chrome-192x192.png',
  '/assets/smd/android-chrome-512x512.png',
  '/assets/smd/apple-touch-icon.png',
  '/assets/smd/site.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(fetch(req).catch(() => caches.match('/index.html')));
  } else {
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  }
});
