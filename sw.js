const staticCacheName = 'restaurant-reviews-static-v1';
const contentImgsCache = 'restaurant-reviews-imgs';
const allCaches = [staticCacheName, contentImgsCache];

const urlsToCache = [
  '/',
  'index.html',
  'restaurant.html',
  'css/styles.css',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
  'data/restaurants.json',
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('restaurant-reviews') && !allCaches.includes(cacheName);
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/img/')) {
      event.respondWith(servePhoto(event.request));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

function servePhoto(request) {
  const storageUrl = request.url;

  return caches.open(contentImgsCache).then((cache) => {
    return cache.match(storageUrl).then((response) => {
      if (response) return response;

      return fetch(request).then((networkResponse) => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
