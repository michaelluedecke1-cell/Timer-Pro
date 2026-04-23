

const CACHE_NAME = 'timer-station-v1';

// Installiert den Service Worker und cached die Basis-Dateien
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['index.html', 'manifest.json']);
    })
  );
});

// Aktivierung und Aufräumen alter Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Hört auf Nachrichten vom Index.html (Timer-Start)
self.addEventListener('message', (event) => {
  if (event.data.type === 'START_TIMER') {
    const { ms, name } = event.data;
    
    // Setzt einen Timeout im Hintergrund
    setTimeout(() => {
      showNotification(name || 'Timer');
    }, ms);
  }
});

function showNotification(timerName) {
  const options = {
    body: `Zeit abgelaufen!`,
    icon: 'https://cdn-icons-png.flaticon.com/128/2699/2699194.png',
    badge: 'https://cdn-icons-png.flaticon.com/128/2699/2699194.png',
    vibrate: [200, 100, 200],
    tag: 'timer-done',
    renotify: true
  };

  self.registration.showNotification(timerName, options);
}

// Reagiert auf Klick auf die Benachrichtigung
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('./');
    })
  );
});

