// ── Cache Version: bump this on every deploy (Vite will inline __CACHE_VERSION__) ──
// Timestamp is baked in at build time so each Vercel deployment gets a fresh cache.
const CACHE_VERSION = '__CACHE_VERSION__';
const CACHE_NAME = `brewcart-${CACHE_VERSION}`;
const SHELL_ASSETS = ['/', '/index.html'];

// ── Install: pre-cache the app shell ──
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
    );
    // Take over immediately — don't wait for old tabs to close
    self.skipWaiting();
});

// ── Activate: clear every old cache, then tell all clients to reload ──
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        ).then(() => {
            // Take control of uncontrolled clients right away
            return self.clients.claim();
        }).then(() => {
            // Notify every open tab that a new version is live → triggers auto-reload
            return self.clients.matchAll({ type: 'window' }).then((clients) => {
                clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }));
            });
        })
    );
});

// ── Fetch: smart routing ──
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Skip non-cacheable or dev-only requests
    if (event.request.method !== 'GET') return;
    if (
        url.startsWith('chrome-extension') ||
        url.includes('hot-update') ||
        url.includes('__vite') ||
        url.includes('ws://') ||
        url.includes('wss://')
    ) return;

    // Network-first for Supabase API calls (always fresh data)
    if (url.includes('/rest/') || url.includes('supabase')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for app shell & static assets
    event.respondWith(
        caches.match(event.request).then((cached) =>
            cached || fetch(event.request).catch(() => new Response('', { status: 408 }))
        )
    );
});

