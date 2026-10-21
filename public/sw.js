const CACHE_NAME = 'rider-horse-v7';
const APP_SHELL = ['/', '/login', '/articles', '/offline.html', '/manifest.webmanifest', '/app-icon.svg', '/app-icon-192.png', '/app-icon-512.png'];
const MEMBER_SHELL = ['/dashboard', '/dashboard/trips', '/dashboard/services', '/dashboard/bookings', '/dashboard/articles', '/dashboard/referrals', '/dashboard/feedback', '/dashboard/profile'];

async function cacheDocumentWithAssets(cache, path) {
  const response = await fetch(path, { credentials: 'include' });
  if (!response.ok || response.redirected) return;

  const html = await response.clone().text();
  await cache.put(path, response.clone());

  const assetUrls = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => new URL(match[1], self.location.origin))
    .filter((url) => url.origin === self.location.origin && url.pathname.startsWith('/_next/'));

  await Promise.allSettled([...new Set(assetUrls.map((url) => url.href))].map(async (url) => {
    const assetResponse = await fetch(url, { credentials: 'same-origin' });
    if (assetResponse.ok) await cache.put(url, assetResponse);
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(url)))));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'CACHE_MEMBER_SHELL') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => Promise.allSettled(MEMBER_SHELL.map((path) => cacheDocumentWithAssets(cache, path))))
    );
  }
  if (event.data?.type === 'CLEAR_MEMBER_SHELL') {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => Promise.all(MEMBER_SHELL.map((path) => cache.delete(path)))));
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (['localhost', '127.0.0.1'].includes(self.location.hostname) && url.pathname.startsWith('/_next/')) return;

  const protectedRoute = url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin') || url.pathname.startsWith('/book');
  if (protectedRoute && request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && !response.redirected) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(url.pathname, copy));
          }
          return response;
        })
        .catch(() => caches.match(url.pathname).then((cached) => cached || caches.match('/offline.html')))
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && !response.redirected) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok && ['style', 'script', 'image', 'font'].includes(request.destination)) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(() => cached))
  );
});
