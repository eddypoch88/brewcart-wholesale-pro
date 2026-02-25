import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

/**
 * PWAUpdatePrompt — shows a bottom banner when a new app version is deployed.
 *
 * Flow:
 *  1. Service worker detects new version → fires 'pwa-update-available' event
 *  2. This banner appears with "Update Now" button
 *  3. User taps → page reloads with new version
 *
 * No Vercel link needed. Works on any installed PWA. ✅
 */
export default function PWAUpdatePrompt() {
    const [show, setShow] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const handleUpdateAvailable = () => setShow(true);
        window.addEventListener('pwa-update-available', handleUpdateAvailable);
        return () => window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    }, []);

    const handleUpdate = () => {
        setUpdating(true);
        const doUpdate = (window as any).__pwaDoUpdate;
        if (typeof doUpdate === 'function') {
            doUpdate();
        } else {
            // Fallback: hard reload
            window.location.reload();
        }
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[9999] animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-900 border border-blue-500/40 rounded-2xl p-4 shadow-2xl shadow-black/40 flex items-center gap-3">
                {/* Icon */}
                <div className="shrink-0 w-9 h-9 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <RefreshCw
                        size={18}
                        className={`text-blue-400 ${updating ? 'animate-spin' : ''}`}
                    />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight">
                        {updating ? 'Updating...' : '🚀 New version available!'}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                        {updating ? 'Please wait...' : 'Tap to get the latest update.'}
                    </p>
                </div>

                {/* Actions */}
                {!updating && (
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={handleUpdate}
                            className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => setShow(false)}
                            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                            aria-label="Dismiss"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
