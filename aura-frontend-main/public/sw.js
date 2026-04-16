/* global clients */
/*
 * Aura Service Worker
 * Handles background push notifications when the browser is closed.
 */

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/icons.svg',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/app/today'
      },
      actions: [
        { action: 'open', title: 'Open Aura' },
        { action: 'close', title: 'Dismiss' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Aura Ritual Reminder', options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
