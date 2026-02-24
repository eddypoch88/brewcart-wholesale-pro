import { useState, useEffect } from 'react';

export function usePWA() {
    const [prompt, setPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
            setPrompt(e);       // Stash the event so it can be triggered later.
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const installApp = async () => {
        if (!prompt) return;

        // Show the install prompt
        prompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await prompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            setPrompt(null); // Hide button after install
        }
    };

    return { isReady: !!prompt, installApp };
}
