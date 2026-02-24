import { Link } from 'react-router-dom';
import { ShoppingCart, Settings } from 'lucide-react';
import { getCart, getSettings } from '../../lib/storage';
import { useState, useEffect } from 'react';
import { StoreSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../data/mockData';
import { usePWA } from '../../hooks/usePWA';

export default function Navbar() {
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
    const [cartCount, setCartCount] = useState(0);
    const { isReady: isPWAReady, installApp } = usePWA();

    useEffect(() => {
        getSettings().then(s => { if (s) setSettings(s); });
    }, []);

    useEffect(() => {
        const updateCount = () => setCartCount(getCart().reduce((s, c) => s + c.qty, 0));
        updateCount();
        window.addEventListener('storage', updateCount);
        window.addEventListener('cart-updated', updateCount);
        return () => {
            window.removeEventListener('storage', updateCount);
            window.removeEventListener('cart-updated', updateCount);
        };
    }, []);


    return (
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center hover:opacity-80 transition">
                    {settings.logo_url ? (
                        <img src={settings.logo_url} alt={settings.store_name} className="h-10 object-contain" />
                    ) : (
                        <span className="text-xl font-bold text-slate-900 tracking-tight">{settings.store_name}</span>
                    )}
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition hidden sm:block">Home</Link>
                    <Link to="/admin" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                        <Settings size={16} />
                        <span className="hidden sm:block">Admin</span>
                    </Link>

                    {isPWAReady && (
                        <button
                            onClick={installApp}
                            className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border border-blue-200 transition shadow-sm animate-pulse"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Install App
                        </button>
                    )}

                    <Link to="/cart" className="relative p-2 text-slate-600 hover:text-slate-900 transition">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
