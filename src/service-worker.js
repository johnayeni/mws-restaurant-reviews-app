import SyncHelper from './scripts/syncHelper.js';

const staticCacheName = 'restaurant-reviews-static-v1';
const contentImgsCache = 'restaurant-reviews-imgs';
const allCaches = [staticCacheName, contentImgsCache];

const urlsToCache = [
  '/',
  'index.html',
  'restaurant.html',
  'css/styles.css',
  'js/bundle.js',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css',
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

  if (requestUrl.origin.startsWith('https://maps.googleapis.com')) {
    return;
  }

  if (requestUrl.pathname.startsWith('/restaurants')) {
    return;
  }

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/img/') || requestUrl.pathname.startsWith('/icons/')) {
      event.respondWith(servePhoto(event.request));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener('sync', async (event) => {
  if (event.tag == 'syncFavorites') {
    event.waitUntil(
      SyncHelper.syncFavorites().catch((err) => {
        if (event.lastChance) {
          SyncHelper.clearStore('offlineFavorites');
        }
      }),
    );
  }
  if (event.tag == 'syncReviews') {
    event.waitUntil(
      SyncHelper.syncReviews()
        .then(function() {
          self.registration.showNotification('Review Posted!');
        })
        .catch((err) => {
          if (event.lastChance) {
            self.registration.showNotification(
              'Some of your reviews have failed to be posted online',
            );
            SyncHelper.clearStore('offlineReviews');
          } else {
            self.registration.showNotification(
              'Some reviews not be posted online, but they will be saved offline for now',
            );
          }
        }),
    );
  }
});

function servePhoto(request) {
  const storageUrl = request.url;

  return caches.open(contentImgsCache).then((cache) => {
    return cache.match(storageUrl, { ignoreSearch: true }).then((response) => {
      if (response) return response;

      return fetch(request).then((networkResponse) => {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
