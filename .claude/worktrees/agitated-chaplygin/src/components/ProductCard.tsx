import React from 'react';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react'; // Tambah Trash2
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onAddToCart: (p: Product) => void;
    onEdit?: (p: Product) => void;
    onDelete?: (id: string) => void; // 🔥 Tambah prop onDelete
    isAdmin?: boolean;
    key?: any; // Fix TS error
}

export default function ProductCard({ product, onAddToCart, onEdit, onDelete, isAdmin }: ProductCardProps) {

    const safeImages = product.images || [];
    const isOutOfStock = product.stock <= 0;

    return (
        <div
            className={`
        group relative bg-white rounded-xl border border-slate-200 overflow-hidden 
        hover:shadow-xl transition-all duration-300 flex flex-col h-full
        ${product.status === 'draft' ? 'opacity-75 border-dashed' : ''}
      `}
            onClick={() => isAdmin && onEdit && onEdit(product)}
        >
            {/* 1. GAMBAR PRODUK */}
            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden group">
                {safeImages[0] ? (
                    <img
                        src={safeImages[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                            e.currentTarget.parentElement!.innerHTML = '<span class="text-slate-400 text-sm">Image Error</span>';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                        Tiada Gambar
                    </div>
                )}

                {/* BADGE STATUS */}
                {product.status === 'draft' && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm">DRAFT</span>
                )}
                {isOutOfStock && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">HABIS STOK</span>
                )}
            </div>

            {/* 2. MAKLUMAT PRODUK */}
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 mb-1 truncate text-lg">{product.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                    {product.description || 'Tiada deskripsi.'}
                </p>

                {/* 3. HARGA & ACTIONS */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div>
                        <span className="text-xl font-bold text-slate-900">RM {product.price.toFixed(2)}</span>
                        {product.compare_at_price && (
                            <span className="block text-xs text-slate-400 line-through">RM {product.compare_at_price.toFixed(2)}</span>
                        )}
                    </div>

                    {isAdmin ? (
                        <div className="flex gap-2">
                            {/* BUTANG EDIT */}
                            <button
                                onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(product); }}
                                className="bg-slate-100 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition"
                                title="Edit Produk"
                            >
                                <Edit className="w-5 h-5" />
                            </button>

                            {/* 🔥 BUTANG DELETE (MERAH) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Elak tertekan card
                                    if (onDelete && confirm(`Betul mau padam "${product.name}"? Tiada undo oo!`)) {
                                        onDelete(product.id);
                                    }
                                }}
                                className="bg-slate-100 text-red-500 p-2 rounded-lg hover:bg-red-100 transition"
                                title="Padam Produk"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                            disabled={isOutOfStock}
                            className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all
                ${isOutOfStock ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-blue-600 active:scale-90'}
              `}
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
