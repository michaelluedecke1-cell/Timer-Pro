
const CACHE_NAME = 'timer-station-v1';

// Installiert den Service Worker und cached die Basis-Dateien
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // WICHTIG: Stelle sicher, dass diese Dateien wirklich existieren!
      return cache.addAll(['index.html', 'manifest.json']);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Hört auf Nachrichten vom Index.html
self.addEventListener('message', (event) => {
  if (event.data.type === 'START_TIMER') {
    const { ms, name } = event.data;
    
    // WICHTIG: event.waitUntil hält den Service Worker aktiv, 
    // bis das Versprechen (Promise) aufgelöst ist.
    event.waitUntil(
      new Promise((resolve) => {
        setTimeout(() => {
          showNotification(name || 'Timer');
          resolve(); // Jetzt darf der Service Worker schlafen gehen
        }, ms);
      })
    );
  }
});

function showNotification(timerName) {
  const options = {
    body: `Zeit abgelaufen!`,
    // Nutze HTTPS Icons, die zuverlässig laden
    icon: 'https://cdn-icons-png.flaticon.com/128/2699/2699194.png',
    badge: 'https://cdn-icons-png.flaticon.com/128/2699/2699194.png',
    vibrate: [200, 100, 200],
    tag: 'timer-done',
    renotify: true,
    requireInteraction: true // Die Benachrichtigung bleibt stehen, bis man klickt
  };

  self.registration.showNotification(timerName, options);
}

// Reagiert auf Klick auf die Benachrichtigung
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('./');
      }
    })
  );
});


