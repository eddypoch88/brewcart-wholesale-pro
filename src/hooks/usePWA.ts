import { useState, useEffect } from 'react';

// ─── Mobile detection ──────────────────────────────────────────────────────
const isMobileDevice = () =>
    typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Global state to store the deferred prompt (desktop only)
let deferredPrompt: any = null;
const listeners = new Set<(isReady: boolean) => void>();

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        const isMobile = isMobileDevice();

        if (isMobile) {
            // On mobile: do NOT call preventDefault.
            // This lets the browser show the native "Add to Home Screen" banner
            // automatically. We don't need to do anything else.
            console.log('[PWA] Mobile device — letting browser show native install banner');
        } else {
            // On desktop: intercept the event and store it for our custom UI
            e.preventDefault();
            deferredPrompt = e;
            listeners.forEach(l => l(true));
            console.log('[PWA] Desktop — deferred install prompt captured for custom UI');
        }
    });
}

export function usePWA() {
    // isReady only matters on desktop (drives custom Install UI visibility)
    const [isReady, setIsReady] = useState(!!deferredPrompt);

    useEffect(() => {
        // Sync with global state (handles case where event fired before mount)
        setIsReady(!!deferredPrompt);

        const listener = (ready: boolean) => setIsReady(ready);
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('[PWA] User accepted install');
            deferredPrompt = null;
            listeners.forEach(l => l(false));
        }
    };

    return { isReady, installApp, isMobile: isMobileDevice() };
}
