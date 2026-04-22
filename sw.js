self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('message', (event) => {
    if (event.data.type === 'START_TIMER') {
        const { ms, name } = event.data;

        setTimeout(() => {
            self.registration.showNotification("Zeit abgelaufen!", {
                body: `Dein Timer "${name}" ist fertig.`,
                icon: "https://cdn-icons-png.flaticon.com/512/2784/2784459.png",
                vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40],
                tag: 'timer-' + Date.now(),
                requireInteraction: true // Nachricht bleibt stehen, bis man sie wegdrückt
            });
        }, ms);
    }
});


