// sw.js — SamDoge PWA (v3)
const CACHE = 'samdoge-v3';               // ⬅️ Incrémente (v4, v5, …) quand tu publies
const ASSETS = [
  '/', '/index.html',
  '/banniere.jpg', '/logo.png',
  '/social-card.png',
  '/favicon.ico', '/favicon-32x32.png', '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  // ajoute ici d'autres fichiers statiques si besoin
];

// Install: pré-cache des assets
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate: nettoyage des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: HTML = network-first ; autres = cache-first (avec mise en cache)
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const accept = req.headers.get('accept') || '';
  const isHTML = accept.includes('text/html');

  if (isHTML) {
    // PAGES -> NETWORK FIRST (avec fallback cache puis index)
    e.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match('/index.html'))
        )
    );
  } else {
    // ASSETS -> CACHE FIRST (et mise à jour silencieuse)
    e.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
            return res;
          })
          .catch(() => cached); // offline sans cache -> rien
        return cached || fetchPromise;
      })
    );
  }
});
