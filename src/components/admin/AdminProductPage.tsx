import React, { useState, useEffect } from 'react';
import { Trash2, Package, Plus, Loader2 } from 'lucide-react';
import ProductForm from '../ProductForm';
import ProductTableRow from './ProductTableRow';
import { Product } from '../../types';
import toast from 'react-hot-toast';
import { useStore } from '../../context/StoreContext';
import { ProductService } from '../../services/product.service';

export default function AdminProductPage() {
    const { store } = useStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // LOGIC FIX: Gabungkan isEditing dengan data product
    // Kalau null = Mode View/List
    // Kalau {} = Mode Create/Edit (check id didalam)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        if (store) loadProducts();
    }, [store]);

    const loadProducts = async () => {
        if (!store) return;
        setLoading(true);
        try {
            const { data } = await ProductService.getAll(store.id);
            if (data) setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    // --- ACTION HANDLERS ---

    const handleCreateNew = () => {
        setEditingProduct(null); // Clear data (Create Mode)
        setIsFormOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product); // Isi data (Edit Mode)
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleFormSuccess = () => {
        handleCloseForm();
        loadProducts(); // Refresh list lepas save
    };

    const handleDeleteProduct = async (id: string) => {
        if (!store) return;
        if (!confirm('Are you sure you want to delete this product?')) return;

        await toast.promise(
            ProductService.delete(id, store.id),
            {
                loading: 'Deleting product...',
                success: 'Product deleted!',
                error: 'Failed to delete.',
            }
        );
        loadProducts();
    };

    // --- BULK ACTIONS ---

    const handleSelect = (id: string, isSelected: boolean) => {
        setSelectedIds(prev =>
            isSelected ? [...prev, id] : prev.filter(item => item !== id)
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds(e.target.checked ? products.map(p => p.id) : []);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.length} products?`)) return;
        if (!store) return;

        const toastId = toast.loading('Deleting products...');

        try {
            // PRO TIP: Guna Promise.all supaya dia delete serentak (Parallel), bukan satu-satu (Sequential)
            await Promise.all(selectedIds.map(id => ProductService.delete(id, store.id)));

            toast.success('Bulk delete complete', { id: toastId });
            setSelectedIds([]);
            loadProducts();
        } catch (error) {
            toast.error('Some deletes failed', { id: toastId });
        }
    };

    if (loading && !isFormOpen) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in relative pb-20">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
                    <p className="text-slate-500 text-sm">{products.length} products total</p>
                </div>

                {!isFormOpen && (
                    <button
                        onClick={handleCreateNew}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2 font-medium"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                )}
            </div>

            {/* FORM vs TABLE SWITCHER */}
            {isFormOpen ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    {/* Pastikan ProductForm terima prop 'initialData' atau 'product' */}
                    <ProductForm
                        initialData={editingProduct}
                        onSuccess={handleFormSuccess}
                        onCancel={handleCloseForm}
                    />
                </div>
            ) : products.length === 0 ? (
                // EMPTY STATE
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Your inventory is empty. Add your first product to get started.</p>
                    <button onClick={handleCreateNew} className="text-blue-600 font-medium hover:underline">
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
                                    <th className="px-6 py-4 w-12 text-center md:table-cell hidden">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={products.length > 0 && selectedIds.length === products.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20 md:table-cell hidden">Image</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider md:table-cell hidden">Product Info</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 md:table-cell hidden">Status / Stock</th>
                                    <th className="px-6 py-4 w-12 md:table-cell hidden"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map(product => (
                                    <ProductTableRow
                                        key={product.id}
                                        product={product}
                                        isSelected={selectedIds.includes(product.id)}
                                        onSelect={handleSelect}
                                        // FIX: Pass function EDIT yang betul
                                        onEdit={() => handleEditProduct(product)}
                                        onDelete={handleDeleteProduct}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* FLOATING BULK DELETE BAR */}
            {selectedIds.length > 0 && !isFormOpen && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300 w-[90%] md:w-auto max-w-md">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center justify-between md:justify-start gap-6 ring-1 ring-white/10">
                        <div className="flex items-center gap-3">
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{selectedIds.length}</span>
                            <span className="text-sm font-medium text-slate-300">Selected</span>
                        </div>
                        <div className="h-4 w-px bg-white/20 hidden md:block" />
                        <div className="flex items-center gap-4">
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