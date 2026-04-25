const CACHE_NAME = "helpdesk-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting(); // ativa mais rápido

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/" // remove /offline por enquanto
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});