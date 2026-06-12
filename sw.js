// Minimal service worker for notifications
self.addEventListener('install', function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const notifData = event.notification.data || {};
    const section = notifData.section || '';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            const scopeUrl = self.registration.scope;
            const targetUrl = scopeUrl + (section ? '#azkar-' + section : '');

            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                        break;
                    }
                }
                client.focus();
                if (section) {
                    client.postMessage({ action: 'openSection', section: section });
                }
                return;
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
