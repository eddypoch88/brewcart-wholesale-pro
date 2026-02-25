import { Link } from 'react-router-dom';
import { ShoppingCart, Settings } from 'lucide-react';
import { getCart } from '../../lib/storage';
import { useState, useEffect } from 'react';
import { usePublicStore } from '../../hooks/usePublicStore';
import { DEFAULT_SETTINGS } from '../../data/mockData';

export default function Navbar() {
    const { settings } = usePublicStore();
    const [cartCount, setCartCount] = useState(0);

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
