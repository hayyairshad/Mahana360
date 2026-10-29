self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || self.registration.scope;
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (const c of list) {
      if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) {
        return c.focus().then(function (w) { return (w || c).navigate ? (w || c).navigate(link) : null; }).catch(function () { return clients.openWindow(link); });
      }
    }
    return clients.openWindow(link);
  }));
});

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD_y2p3AgkqLSodoe7crIJu8q79eKQnVtc",
  authDomain: "taskando-ae850.firebaseapp.com",
  projectId: "taskando-ae850",
  storageBucket: "taskando-ae850.firebasestorage.app",
  messagingSenderId: "503577778203",
  appId: "1:503577778203:web:b98f7dba77f7e8421480be"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const d = (payload && payload.data) || {};
  return self.registration.showNotification(d.title || 'Taskando', {
    body: d.body || '',
    icon: 'icon-192.png',
    badge: 'badge-72.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    data: { link: d.link || self.registration.scope }
  });
});
