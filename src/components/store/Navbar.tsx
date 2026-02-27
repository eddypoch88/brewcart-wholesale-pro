import { Link, useParams } from 'react-router-dom';
import { ShoppingCart, Store, TrendingUp } from 'lucide-react';
import { getCart } from '../../lib/storage';
import { useState, useEffect } from 'react';
import { usePublicStore } from '../../hooks/usePublicStore';
import { supabase } from '../../lib/supabase';

export default function Navbar() {
    const { slug } = useParams<{ slug?: string }>();
    const { settings } = usePublicStore(slug);
    const [cartCount, setCartCount] = useState(0);
    const [isSeller, setIsSeller] = useState(false);

    // Check if user is logged in (seller)
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setIsSeller(!!user);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
            setIsSeller(!!session?.user);
        });
        return () => subscription.unsubscribe();
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
                <Link to={slug ? `/store/${slug}` : '/'} className="flex items-center hover:opacity-80 transition">
                    {settings.logo_url ? (
                        <img src={settings.logo_url} alt={settings.store_name} className="h-10 object-contain" />
                    ) : (
                        <span className="text-xl font-bold text-slate-900 tracking-tight">{settings.store_name}</span>
                    )}
                </Link>

                <div className="flex items-center gap-3">
                    <Link to={slug ? `/store/${slug}` : '/'} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition hidden sm:block">Home</Link>

                    {/* Seller / Buyer CTA */}
                    {isSeller ? (
                        <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 sm:px-3 py-1.5 rounded-full transition-all"
                        >
                            <Store size={14} />
                            <span>My Shop</span>
                        </Link>
                    ) : (
                        <Link
                            to="/register"
                            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 sm:px-3 py-1.5 rounded-full transition-all shadow-sm shadow-indigo-200"
                        >
                            <TrendingUp size={14} />
                            <span className="hidden sm:inline">Start Selling on ORB</span>
                            <span className="sm:hidden">Sell</span>
                        </Link>
                    )}

                    {/* Cart */}
                    <Link to={slug ? `/store/${slug}/cart` : '/cart'} className="relative p-2 text-slate-600 hover:text-slate-900 transition">
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

