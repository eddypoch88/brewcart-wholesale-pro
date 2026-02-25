import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export default function InstallPrompt() {
    const { isReady, installApp, isMobile } = usePWA();
    const [dismissed, setDismissed] = useState(false);

    // On mobile the browser shows the native "Add to Home Screen" banner automatically.
    // Our custom UI is only needed on desktop where we captured the deferred prompt.
    if (isMobile) return null;

    return (
        <AnimatePresence>
            {isReady && !dismissed && (
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 150, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[380px] z-[100]"
                >
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-4 rounded-[24px] shadow-2xl flex items-center gap-4 relative overflow-hidden group">
                        {/* Glass reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 dark:via-white/5 pointer-events-none rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(37,99,235,0.4)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/20" />
                            <Download className="text-white w-6 h-6 drop-shadow-md z-10" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight tracking-tight">Install BrewCart</h3>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug font-medium">Fast, seamless &amp; native experience</p>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0 z-10">
                            <button
                                onClick={installApp}
                                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-slate-900/20 dark:shadow-white/20 hover:scale-105"
                            >
                                Get App
                            </button>
                        </div>

                        <button
                            onClick={() => setDismissed(true)}
                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                            aria-label="Dismiss"
                        >
                            <X size={14} strokeWidth={3} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
