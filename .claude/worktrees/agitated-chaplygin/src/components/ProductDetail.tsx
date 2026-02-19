import React from 'react';
import { ArrowLeft, Star, Heart, Share2 } from 'lucide-react';
import ProductBottomBar from './ProductBottomBar';

interface ProductDetailProps {
    product: any;
    onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
    if (!product) return null;

    // Clean price logic
    let numericPrice = 0;
    if (typeof product.price === 'number') {
        numericPrice = product.price;
    } else if (typeof product.price === 'string') {
        const matches = product.price.match(/[\d.]+/);
        if (matches) numericPrice = parseFloat(matches[0]);
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-32 relative">
            {/* Navbar Overlay */}
            <div className="fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-700 hover:bg-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-700 hover:bg-white hover:text-rose-600">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-700 hover:bg-white">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Hero Image */}
            <div className="aspect-square bg-white relative">
                <img
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="-mt-6 bg-slate-50 rounded-t-3xl relative z-10 px-5 pt-8 pb-4 space-y-4">

                {/* Title & Price */}
                <div>
                    <div className="flex items-start justify-between gap-4">
                        <h1 className="text-xl font-bold text-slate-900 leading-tight">
                            {product.name || product.title}
                        </h1>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-bold text-rose-600">
                                {typeof product.price === 'number'
                                    ? new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(product.price)
                                    : product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-slate-400 line-through decoration-rose-500/50">
                                    {product.originalPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rating & Sold */}
                <div className="flex items-center gap-4 text-sm border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{product.rating || '5.0'}</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500">{product.sold || '100+'} Sold</span>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <h3 className="font-bold text-slate-900">Description</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {product.description || 'No description available for this product. Contact seller for more info.'}
                    </p>
                </div>

            </div>

            {/* The Requested Bottom Bar */}
            <ProductBottomBar
                productName={product.name || product.title}
                price={numericPrice}
                phone="60123456789"
            />
        </div>
    );
}
