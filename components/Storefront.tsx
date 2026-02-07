import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useFirestoreDocument } from '../src/hooks/useFirestore';
import { storeConfig } from '../src/config/store';
import ConnectionStatus from './ConnectionStatus';
import ProductCard from './ProductCard';

interface StorefrontProps {
    products: any[];
}

const Storefront: React.FC<StorefrontProps> = ({ products }) => {
    // Fetch dynamic store settings, specifically for theme colors
    const { data: settings } = useFirestoreDocument('settings', 'general');

    // Safety check
    const displayItems = products || [];

    // Inject dynamic colors
    const themeStyles = {
        '--primary-color': settings?.primaryColor || storeConfig.primaryColor || '#2563eb',
        '--secondary-color': settings?.secondaryColor || storeConfig.secondaryColor || '#1e293b',
    } as React.CSSProperties;

    return (
        <div className="bg-slate-50 dark:bg-black min-h-screen relative pb-32 font-sans" style={themeStyles}>
            <ConnectionStatus />


            {/* Store Header */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {storeConfig.storeName} <span className="text-primary">Store</span>
                </h1>
                <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    <ShoppingCart className="text-slate-700 dark:text-white" size={24} />
                    <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black">
                        0
                    </span>
                </button>
            </div>

            {/* Creative Sandbox: Hero Section */}
            <div className="px-6 py-8 bg-gradient-to-r from-primary/10 to-secondary/10 mb-6 mx-4 rounded-3xl mt-4">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {storeConfig.heroTitle}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                    {storeConfig.heroSubtitle}
                </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 px-4 mb-20">
                {displayItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Storefront;
