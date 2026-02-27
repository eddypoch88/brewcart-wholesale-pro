// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
// We can't use import.meta.env here easily, so we rely on URL params or just inject it during build.
// Since it's public, hardcoding the non-sensitive public IDs is acceptable as standard Firebase practice.
firebase.initializeApp({
    apiKey: "AIzaSyAq9SV9nJ4QDv6gtCJ8vqHn3o-BRK7omSs",
    authDomain: "saas-multi-tenant-commerce.firebaseapp.com",
    projectId: "saas-multi-tenant-commerce",
    storageBucket: "saas-multi-tenant-commerce.firebasestorage.app",
    messagingSenderId: "227943129206",
    appId: "1:227943129206:web:eb5530e82c1dc4c9e96f57"
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);

    const notificationTitle = payload.notification.title || 'New Order!';
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png', // Or a monochrome badge icon
        tag: 'new-order',
        requireInteraction: true,
        data: payload.data,
        actions: [
            { action: 'view', title: 'View Order' },
            { action: 'close', title: 'Dismiss' }
        ]
    };

    // Update badge if supported
    if ('setAppBadge' in navigator) {
        navigator.setAppBadge(1);
    }

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Clear badge
    if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge();
    }

    if (event.action === 'view' || !event.action) {
        // Open app to orders page
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then((windowClients) => {
                // If app is already open, focus it
                for (let i = 0; i < windowClients.length; i++) {
                    const client = windowClients[i];
                    if (client.url.includes('/admin/orders') && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise open new window
                if (clients.openWindow) {
                    return clients.openWindow('/admin/orders');
                }
            })
        );
    }
});
