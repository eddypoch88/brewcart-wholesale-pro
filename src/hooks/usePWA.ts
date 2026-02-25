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
        // ALWAYS intercept the event and store it for our custom UI
        // This stops the browser's default mini-infobar and lets our "Get App" button trigger the real install popup
        e.preventDefault();
        deferredPrompt = e;
        listeners.forEach(l => l(true));
        console.log('[PWA] Deferred install prompt captured for custom UI');
    });
}

// ─── PWA Installed Detection ──────────────────────────────────────────────────
const isAppInstalled = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
};

export function usePWA() {
    // isReady only matters on desktop (drives custom Install UI visibility)
    const [isReady, setIsReady] = useState(!!deferredPrompt);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Initial check
        setIsInstalled(isAppInstalled());

        // Listen for the 'appinstalled' event
        const handleInstalled = () => {
            console.log('[PWA] App was installed via event');
            setIsInstalled(true);
        };
        window.addEventListener('appinstalled', handleInstalled);

        // Listen for match-media changes (when user opens the standalone app)
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsInstalled(e.matches);
        };
        
        // Use modern addEventListener if available, otherwise try addListener (older Safaris)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        }

        // Sync with global state (handles case where event fired before mount)
        setIsReady(!!deferredPrompt);

        const listener = (ready: boolean) => setIsReady(ready);
        listeners.add(listener);
        return () => { 
            listeners.delete(listener); 
            window.removeEventListener('appinstalled', handleInstalled);
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            }
        };
    }, []);

    const installApp = async (): Promise<boolean> => {
        if (!deferredPrompt) {
            console.log('[PWA] No deferred prompt available. Falling back to manual instructions.');
            return false;
        }

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                console.log('[PWA] User accepted install');
                deferredPrompt = null;
                listeners.forEach(l => l(false));
                return true;
            } else {
                console.log('[PWA] User dismissed install prompt');
                return true; // The native prompt worked, they just said no. No manual instructions needed.
            }
        } catch (err) {
            console.error('[PWA] Error showing install prompt:', err);
            return false;
        }
    };

    return { isReady, installApp, isMobile: isMobileDevice(), isInstalled };
}
