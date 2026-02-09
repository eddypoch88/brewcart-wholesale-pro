import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Edit3, ImageOff, MoreVertical } from 'lucide-react';
import { Product } from '../types';

interface Props {
    product: Product;
    isSelected: boolean;
    onSelect: (id: string, selected: boolean) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export const ProductTableRow: React.FC<Props> = ({ product, isSelected, onSelect, onEdit, onDelete }) => {
    const [imageError, setImageError] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const imageUrl = product.images?.[0];

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

    return (
        <tr className={`h-20 border-b border-gray-100 transition-colors ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-gray-50/50'}`}>
            {/* CHECKBOX */}
            <td className="px-6 py-4 whitespace-nowrap w-12 text-center">
                <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={isSelected}
                    onChange={(e) => onSelect(product.id, e.target.checked)}
                />
            </td>

            {/* IMAGE */}
            <td className="px-6 py-4 whitespace-nowrap w-20">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm">
                    {!imageError && imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <ImageOff className="text-gray-400" size={24} />
                    )}
                </div>
            </td>

            {/* INFO (Name & Price) */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{product.name}</span>
                    <span className="text-xs font-medium text-gray-500 mt-0.5">RM {product.price?.toFixed(2)}</span>
                </div>
            </td>

            {/* STOCK */}
            <td className="px-6 py-4 whitespace-nowrap w-24">
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-gray-700' : 'text-red-600'}`}>
                    {product.stock} units
                </span>
            </td>

            {/* STATUS */}
            <td className="px-6 py-4 whitespace-nowrap w-24">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize items-center justify-center
            ${product.status === 'active' || product.status === 'In Stock'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                    {product.status || 'Draft'}
                </span>
            </td>

            {/* ACTIONS (3-dot Menu) */}
            <td className="px-6 py-4 whitespace-nowrap text-right w-12">
                <div className="relative inline-block text-left" ref={menuRef}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(product); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Edit3 size={16} /> Edit Product
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
};
