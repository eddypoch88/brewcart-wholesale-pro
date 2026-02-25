import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, MoreVertical } from 'lucide-react'; // Tambah icon baru
import { usePWA } from '../../hooks/usePWA';

export default function InstallPrompt() {
    const { installApp, isInstalled } = usePWA();
    const [dismissed, setDismissed] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [showInstruction, setShowInstruction] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Only show if client-side, user hasn't dismissed it, and app is NOT already installed
    const shouldShow = isClient && !dismissed && !isInstalled;

    const handleInstallClick = async (e: any) => {
        e.stopPropagation();

        // Attempt native install flow
        const success = await installApp();

        // If native failed (no prompt available, iOS, or blocked), show manual instructions
        if (!success) {
            setShowInstruction(true);
            setTimeout(() => setShowInstruction(false), 8000);
        }
    };

    if (!shouldShow) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 150, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 150, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[380px] z-[100]"
            >
                {/* --- POP-UP AJAR MANUAL (Akan keluar bila auto-install tak jalan) --- */}
                {showInstruction && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: -10 }}
                        className="absolute -top-32 left-0 right-0 bg-slate-800 text-white p-4 rounded-xl text-sm shadow-xl z-50 border border-slate-600"
                    >
                        <p className="font-bold text-amber-400 mb-1">📲 Manual Install:</p>
                        <ol className="list-decimal ml-4 space-y-1 text-slate-200">
                            <li>Tap browser menu <MoreVertical className="inline w-4 h-4" /> or <Share className="inline w-4 h-4" /></li>
                            <li>Select <b>"Add to Home Screen"</b></li>
                            <li>Tap <b>"Install"</b></li>
                        </ol>
                        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45 border-r border-b border-slate-600"></div>
                    </motion.div>
                )}

                {/* --- BANNER UTAMA --- */}
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-4 rounded-[24px] shadow-2xl flex items-center gap-4 relative overflow-hidden group">

                    {/* Glass Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 dark:via-white/5 pointer-events-none rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Icon */}
                    <div
                        onClick={handleInstallClick}
                        className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(37,99,235,0.4)] relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
                    >
                        <div className="absolute inset-0 bg-white/20" />
                        <Download className="text-white w-6 h-6 drop-shadow-md z-10" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 cursor-pointer" onClick={handleInstallClick}>
                        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                            Install BrewCart
                        </h3>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug font-medium">
                            Fast, seamless & native experience
                        </p>
                    </div>

                    {/* Button Get App */}
                    <div className="flex flex-col gap-2 shrink-0 z-10">
                        <button
                            onClick={handleInstallClick}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-slate-900/20 dark:shadow-white/20 hover:scale-105"
                        >
                            Get App
                        </button>
                    </div>

                    {/* Close X */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDismissed(true);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                        aria-label="Dismiss"
                    >
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}