import { useState, useEffect } from 'react';

// Global state to store the prompt event
let deferredPrompt: any = null;
const listeners = new Set<(isReady: boolean) => void>();

// Attach the listener globally as soon as this file is loaded
if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        listeners.forEach(listener => listener(true));
    });
}

export function usePWA() {
    const [isReady, setIsReady] = useState(!!deferredPrompt);

    useEffect(() => {
        // Sync local state with global state immediately on mount
        setIsReady(!!deferredPrompt);

        // Register listener for future updates
        const listener = (ready: boolean) => setIsReady(ready);
        listeners.add(listener);

        return () => {
            listeners.delete(listener);
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;

        // Show the prompt
        deferredPrompt.prompt();

        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            deferredPrompt = null;
            listeners.forEach(listener => listener(false));
        }
    };

    return { isReady, installApp };
}
