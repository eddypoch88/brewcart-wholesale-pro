const CACHE_NAME = 'brewcart-v2';
const SHELL_ASSETS = [
    '/',
    '/index.html',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Skip non-GET requests (POST, etc.) — cannot be cached
    if (event.request.method !== 'GET') return;

    // Skip dev-only / extension requests
    if (
        url.startsWith('chrome-extension') ||
        url.includes('hot-update') ||
        url.includes('__vite') ||
        url.includes('ws://') ||
        url.includes('wss://')
    ) return;

    // Network-first for Supabase API calls
    if (url.includes('/rest/') || url.includes('supabase')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for everything else (app shell, assets)
    event.respondWith(
        caches.match(event.request).then((cached) =>
            cached || fetch(event.request).catch(() => new Response('', { status: 408 }))
        )
    );
});
