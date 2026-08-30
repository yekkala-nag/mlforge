const CACHE_NAME = "ml-forge-v1";
const STATIC_CACHE = "ml-forge-static-v1";

const PRECACHE_URLS = [
  "/",
  "/playground",
  "/math",
  "/from-scratch",
  "/datasets",
  "/challenges",
  "/arena",
  "/ops",
  "/capstone",
  "/learn",
  "/labs",
  "/system-builder",
  "/agents",
  "/settings",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch(() => {
            // Silently ignore individual route precache misses during first install
          })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Return cached, but also fetch fresh version in background
        event.waitUntil(
          fetch(event.request)
            .then((response) => {
              if (response.ok) {
                return caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, response.clone());
                });
              }
            })
            .catch(() => {})
        );
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response.ok) return response;
          const clone = response.clone();
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
            return response;
          });
        })
        .catch(() => {
          // Offline fallback for navigation
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503 });
        });
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
