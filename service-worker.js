const CACHE_NAME = "attendance-v2";

const urlsToCache = [
    "/attendance-management-system/",
    "/attendance-management-system/index.html",
    "/attendance-management-system/style.css",
    "/attendance-management-system/script.js",
    "/attendance-management-system/manifest.json",
    "/attendance-management-system/icon.png"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(cache => {

            return cache.addAll(urlsToCache);

        })

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
        .then(response => {

            return response || fetch(event.request);

        })

    );

});