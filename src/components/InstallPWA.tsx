import { useState, useEffect } from "react";

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // 1. Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // 2. Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // 3. Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // 4. Show the install prompt
        deferredPrompt.prompt();

        // 5. Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            console.log("User accepted the install prompt");
        }

        // 6. We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={handleInstallClick}
            className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold flex items-center gap-2 animate-bounce z-50"
        >
            ⬇️ Install App
        </button>
    );
};

export default InstallPWA;
