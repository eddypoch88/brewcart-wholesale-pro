import React, { useState } from 'react';
import { Trash2, Package, Plus } from 'lucide-react';
import ProductForm from '../ProductForm';
import ProductTableRow from './ProductTableRow';
import { Product } from '../../types';
import toast from 'react-hot-toast';

interface AdminProductPageProps {
    products: Product[];
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    loadProducts: () => void;
    handleDeleteProduct: (id: string) => void;
}

export default function AdminProductPage({
    products,
    isEditing,
    setIsEditing,
    loadProducts,
    handleDeleteProduct
}: AdminProductPageProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Bulk Select Logic
    const handleSelect = (id: string, isSelected: boolean) => {
        setSelectedIds(prev =>
            isSelected ? [...prev, id] : prev.filter(item => item !== id)
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds(e.target.checked ? products.map(p => p.id) : []);
    };

    // Bulk Delete Logic (Mock implementation wrapping single delete for now, or using props if available)
    // Since handleDeleteProduct only takes one ID, we will iterate. 
    // Ideally service should support bulk, but sticking to props provided.
    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.length} products?`)) return;

        // Optimistic UI update or wait for all? 
        // Let's loop and delete using the prop provided
        for (const id of selectedIds) {
            await handleDeleteProduct(id);
        }
        setSelectedIds([]);
        toast.success('Bulk delete complete');
    };

    return (
        <div className="space-y-6 animate-fade-in relative pb-20">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
                    <p className="text-slate-500 text-sm">{products.length} products total</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2 font-medium"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* EDIT FORM or TABLE */}
            {isEditing ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <ProductForm onSuccess={() => { setIsEditing(false); loadProducts(); }} onCancel={() => setIsEditing(false)} />
                </div>
            ) : products.length === 0 ? (
                // EMPTY STATE
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Your inventory is empty. Add your first product to get started.</p>
                    <button onClick={() => setIsEditing(true)} className="text-blue-600 font-medium hover:underline">
                        Create new product
                    </button>
                </div>
            ) : (
                // TABLE LAYOUT
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 w-12 text-center">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={products.length > 0 && selectedIds.length === products.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">Image</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Status / Stock</th>
                                    <th className="px-6 py-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map(product => (
                                    <ProductTableRow
                                        key={product.id}
                                        product={product}
                                        isSelected={selectedIds.includes(product.id)}
                                        onSelect={handleSelect}
                                        onEdit={() => setIsEditing(true)}
                                        onDelete={handleDeleteProduct}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* FLOATING BULK DELETE BAR */}
            {selectedIds.length > 0 && !isEditing && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 ring-1 ring-white/10">
                        <div className="flex items-center gap-3">
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{selectedIds.length}</span>
                            <span className="text-sm font-medium text-slate-300">Selected</span>
                        </div>
                        <div className="h-4 w-px bg-white/20" />
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSelectedIds([])} className="text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleBulkDelete} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors">
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
