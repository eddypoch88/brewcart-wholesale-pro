import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, Package } from 'lucide-react';
import { Product } from '../../types';

interface ProductTableRowProps {
    product: Product;
    isSelected: boolean;
    onSelect: (id: string, selected: boolean) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function ProductTableRow({ product, isSelected, onSelect, onEdit, onDelete }: ProductTableRowProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const safeImages = product.images || [];

    return (
        <tr className={`
            md:table-row md:border-b md:border-slate-100 md:hover:bg-slate-50 md:transition-colors md:bg-transparent
            grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 p-4 border border-slate-200 rounded-xl mb-3 bg-white relative shadow-sm hover:shadow-md transition-shadow
            ${isSelected ? 'bg-blue-50/50 border-blue-200' : ''}
        `}>
            {/* Checkbox */}
            <td className="md:table-cell md:w-12 md:px-6 md:py-4 absolute top-4 left-4 z-10 md:static">
                <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={isSelected}
                    onChange={(e) => onSelect(product.id, e.target.checked)}
                />
            </td>

            {/* Thumbnail */}
            <td className="md:table-cell md:w-20 md:px-6 md:py-4 pl-10 md:pl-0">
                <div className="h-14 w-14 rounded-md overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    {safeImages[0] ? (
                        <img
                            src={safeImages[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Package size={20} />
                        </div>
                    )}
                </div>
            </td>

            {/* Name + Price */}
            <td className="md:table-cell md:px-6 md:py-4 self-center">
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-base truncate max-w-[200px] md:max-w-xs">{product.name}</span>
                    <span className="text-sm text-blue-600 font-bold mt-0.5">RM {product.price.toFixed(2)}</span>
                </div>
            </td>

            {/* Status / Stock */}
            <td className="md:table-cell md:w-32 md:px-6 md:py-4 col-start-2 -mt-2 md:mt-0 md:col-auto">
                <div className="flex flex-row md:flex-col gap-2 md:gap-1 items-center md:items-start">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border
                        ${product.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {product.status || 'Draft'}
                    </span>
                    <span className={`text-xs font-medium ${product.stock > 0 ? 'text-slate-500' : 'text-red-500'}`}>
                        {product.stock} in stock
                    </span>
                </div>
            </td>

            {/* Actions */}
            <td className="md:table-cell md:w-12 md:text-right md:px-6 md:py-4 absolute top-2 right-2 md:static">
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <MoreVertical size={18} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(product); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <Edit size={16} /> Edit Product
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(product.id); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Delete Product
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
}
