const CACHE_NAME = "feb14-v3";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./img/phone.svg",
  "./img/phoneBg.jpg",
  "./img/albumTape.png",
  "./img/albumTape2.jpg",
  "./img/albumTape3.png",
  "./img/albumTape4.png",
  "./img/albumTape5.jpg",
  "./img/albumTape6.png",
  "./img/albumTape7.jpg",
  "./img/albumTape8.jpg",
  "./img/icon.png",
  "./img/user.svg",
  "./img/environmentBgDesktop.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  if (url.pathname.endsWith(".mp3")) {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(e.request).then((cached) => {
          if (cached) return cached;
          return fetch(e.request).then((response) => {
            cache.put(e.request, response.clone());
            return response;
          });
        }),
      ),
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request)),
  );
});
