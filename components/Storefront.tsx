import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface StorefrontProps {
    products: any[];
}

const Storefront: React.FC<StorefrontProps> = ({ products }) => {
    // Safety check
    const displayItems = products || [];

    return (
        <div className="bg-slate-50 dark:bg-black min-h-screen relative pb-32 font-sans">

            {/* Store Header */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between shadow-sm">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    BrewCart <span className="text-indigo-600">Wholesale</span>
                </h1>
                <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    <ShoppingCart className="text-slate-700 dark:text-white" size={24} />
                    <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black">
                        0
                    </span>
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-5 px-4 pt-6">
                {displayItems.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white dark:bg-surface-dark p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 relative overflow-hidden group h-full flex flex-col min-h-[210px]"
                    >
                        {/* Image Area - Compact & Rounded */}
                        <div className="h-24 rounded-2xl bg-slate-50 dark:bg-slate-900 mb-3 overflow-hidden flex items-center justify-center relative">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="text-slate-300 text-[10px] uppercase font-bold tracking-widest">No Image</div>
                            )}
                        </div>

                        {/* Floating Stock Badge */}
                        <div className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full z-10 shadow-sm ${(typeof product.stock === 'number' ? product.stock : parseInt(product.stock)) < 100
                                ? 'bg-red-100 text-red-600'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}>
                            {(typeof product.stock === 'number' ? product.stock : parseInt(product.stock)) < 100 ? 'Low Stock' : 'In Stock'}
                        </div>

                        {/* Info Area */}
                        <div className="flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight text-sm tracking-tight line-clamp-2 mb-1">
                                {product.name}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 line-clamp-1">{product.description}</p>

                            <div className="mt-auto flex items-center justify-between gap-2">
                                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                    {product.price}
                                </p>
                            </div>

                            {/* Add to Cart Button */}
                            <button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none text-sm active:scale-95 transition-all">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Storefront;
