import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useFirestoreDocument } from '../src/hooks/useFirestore';
import { storeConfig } from '../src/config/store';
import ConnectionStatus from './ConnectionStatus';
import ProductCard from './ProductCard';

interface StorefrontProps {
    products: any[];
    onProductClick?: (product: any) => void;
}

const Storefront: React.FC<StorefrontProps> = ({ products, onProductClick }) => {
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


            {/* Store Header (Compact) */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-3 py-2 flex items-center justify-between shadow-sm">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                    {storeConfig.storeName} <span className="text-primary text-xs ml-1">Official</span>
                </h1>
                <button className="relative p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    <ShoppingCart className="text-slate-700 dark:text-white" size={20} />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black">
                        0
                    </span>
                </button>
            </div>

            {/* Creative Sandbox: Hero Section (Compact) */}
            <div className="px-2 pt-2 pb-4">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 mb-3 text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 leading-tight">
                        {storeConfig.heroTitle}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {storeConfig.heroSubtitle}
                    </p>
                </div>

                {/* Product Grid (TikTok Style: Gap-2) */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {displayItems.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => onProductClick && onProductClick(product)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Storefront;
