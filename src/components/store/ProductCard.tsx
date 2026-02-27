import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Package } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Image */}
            <div className="aspect-square bg-slate-100 overflow-hidden relative">
                {product.images?.[0] ? (
                    <>
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <div className="hidden absolute inset-0 w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                            <Package size={48} />
                            <span className="text-xs font-semibold mt-2">Image unavailable</span>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={48} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-blue-600">RM {product.price.toFixed(2)}</span>
                    {product.compare_at_price > product.price && (
                        <span className="text-sm text-slate-400 line-through">RM {product.compare_at_price.toFixed(2)}</span>
                    )}
                </div>
                {product.stock <= 0 ? (
                    <span className="inline-block mt-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded">Out of Stock</span>
                ) : (
                    <span className="inline-block mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">{product.stock} in stock</span>
                )}
            </div>
        </Link>
    );
}
