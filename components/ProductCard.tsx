import React from 'react';
import { Heart, Star } from 'lucide-react';

interface ProductProps {
    id: string | number;
    title?: string;
    name?: string; // Fallback for title
    price: number | string;
    image: string;
    rating?: number;
    sold?: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
    // Normalize data (handle both 'title' and 'name' as seen in App.tsx vs request)
    const title = product.title || product.name || 'Untitled';

    // Clean price for formatting if it's a string like "RM 145.00"
    let numericPrice = 0;
    if (typeof product.price === 'number') {
        numericPrice = product.price;
    } else if (typeof product.price === 'string') {
        // Remove non-numeric chars except dot
        const matches = product.price.match(/[\d.]+/);
        if (matches) numericPrice = parseFloat(matches[0]);
    }

    // Format duit jadi RM yang cantik
    const formattedPrice = new Intl.NumberFormat('ms-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 0,
    }).format(numericPrice);

    return (
        <a href={`/product/${product.id}`} className="group block h-full">
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-300 relative h-full flex flex-col">

                {/* GAMBAR 1:1 (The "Love" Window) */}
                <div className="aspect-square relative bg-slate-50 overflow-hidden">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                            No Image
                        </div>
                    )}
                    {/* Heart Icon (Wishlist) - Optional tapi "Sexy" */}
                    <button className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-rose-50 hover:text-rose-600">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                {/* INFO SECTION (Padat & Jelas) */}
                <div className="p-3 space-y-2 flex-1 flex flex-col">
                    {/* Title - Limit 2 baris (Shopee Style) */}
                    <h3 className="text-sm text-slate-700 font-medium leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>

                    <div className="space-y-1 mt-auto">
                        {/* Price - Warna "Cinta" (Rose/Red) */}
                        <div className="text-base font-bold text-rose-600">
                            {formattedPrice}
                        </div>

                        {/* Rating & Sold (Social Proof) */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating || '5.0'}</span>
                            <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                            <span>{product.sold || '100+'} Sold</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}
