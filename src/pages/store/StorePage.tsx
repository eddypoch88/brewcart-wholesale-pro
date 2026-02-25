import { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../../lib/storage';
import { Product } from '../../types';
import ProductCard from '../../components/store/ProductCard';
import { ShoppingBag, Sparkles, Loader2, Search, X } from 'lucide-react';
import { usePublicStore } from '../../hooks/usePublicStore';

export default function StorePage() {
    // usePublicStore resolves storeId + settings without requiring user login
    const { storeId, settings, loading: storeLoading } = usePublicStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        if (storeLoading || !storeId) return;
        async function loadData() {
            try {
                const fetchedProducts = await getProducts(storeId!);
                setProducts(fetchedProducts.filter(p => p.status === 'active'));
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [storeId, storeLoading]);

    // Derive unique categories
    const categories = useMemo(() => {
        const cats = new Set<string>();
        products.forEach(p => {
            if (p.category) cats.add(p.category);
        });
        return ['All', ...Array.from(cats).sort()];
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

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

            {/* PRODUCTS SECTION */}
            <section id="products" className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Our Products</h2>
                    <p className="text-slate-500">Fresh, handcrafted, and made to order.</p>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 border border-slate-200 rounded-full bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Pills */}
                {categories.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-6 justify-center flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm mt-1">Try a different search or category</p>
                        {(searchQuery || selectedCategory !== 'All') && (
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
