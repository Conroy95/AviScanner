const CACHE_NAME = 'jarvis-osint-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/script.js',
    './js/app.js',
    './manifest.json',
    './fav/favicon.ico',
    './fav/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
