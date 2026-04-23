
const CACHE_NAME = 'timer-pro-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['index.html', 'manifest.json']);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'START_TIMER') {
    const { ms, name } = event.data;
    setTimeout(() => {
      self.registration.showNotification(name || 'Timer', {
        body: 'Zeit abgelaufen!',
        icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972531.png',
        vibrate: [200, 100, 200],
        badge: 'https://cdn-icons-png.flaticon.com/512/2972/2972531.png'
      });
    }, ms);
  }
});


