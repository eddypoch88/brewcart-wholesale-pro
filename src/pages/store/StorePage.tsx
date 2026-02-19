import { useState, useEffect } from 'react';
import { getProducts, getSettings } from '../../lib/storage';
import { Product, StoreSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../data/mockData';
import ProductCard from '../../components/store/ProductCard';
import { ShoppingBag, Sparkles, Loader2 } from 'lucide-react';

export default function StorePage() {
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [fetchedProducts, fetchedSettings] = await Promise.all([
                    getProducts(),
                    getSettings()
                ]);
                setProducts(fetchedProducts.filter(p => p.status === 'active'));
                setSettings(fetchedSettings);
            } catch (error) {
                console.error('Failed to load store data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    return (
        <div>
            {/* HERO */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
                </div>
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-blue-200 mb-6">
                        <Sparkles size={14} /> Premium Quality
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                        {settings.store_name}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                        Handcrafted beverages made with love. Browse our collection and order your favorites.
                    </p>
                    <a href="#products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40">
                        <ShoppingBag size={18} /> Shop Now
                    </a>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section id="products" className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Our Products</h2>
                    <p className="text-slate-500">Fresh, handcrafted, and made to order.</p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p className="text-lg">No products available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
