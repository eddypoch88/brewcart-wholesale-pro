import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Store as StoreIcon, Package, Activity, DollarSign, ArrowLeft, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '../../types';
import { SkeletonCard, SkeletonTable } from '../../components/ui/Skeleton';

interface StoreDetails {
    id: string;
    name: string;
    slug: string;
    subdomain?: string;
    created_at: string;
    owner_id: string;
    status: string;
}

export default function StoreDetail() {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState<StoreDetails | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!storeId) return;
        loadStoreDetails();
    }, [storeId]);

    const loadStoreDetails = async () => {
        try {
            // Fetch store info
            const { data: storeData, error: storeError } = await supabase
                .from('stores')
                .select('*')
                .eq('id', storeId)
                .single();

            if (storeError) throw storeError;
            setStore({ ...storeData, status: 'Active' });

            // Fetch products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('store_id', storeId)
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;
            setProducts(productsData || []);

        } catch (error: any) {
            console.error('Error fetching store details:', error);
            toast.error('Failed to load store details');
            navigate('/super-admin');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between gap-6 mb-6">
                    <div className="w-1/2"><SkeletonCard /></div>
                    <div className="w-1/2"><SkeletonCard /></div>
                </div>
                <div className="w-full">
                    <SkeletonTable columns={5} rows={3} />
                </div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="text-center py-20 text-slate-500">
                Store not found.
            </div>
        );
    }

    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const inventoryValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/super-admin')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Stores
            </button>

            {/* Store Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <StoreIcon className="w-7 h-7 text-indigo-500" />
                        {store.name}
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">
                            {store.status}
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                        <p className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg font-mono text-xs">
                            /store/{store.slug}
                            <a href={`/store/${store.slug}`} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </p>
                        <p>Joined {new Date(store.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Metrics Summaries */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/10 text-center min-w-[120px]">
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-1">Products</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{products.length}</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/10 text-center min-w-[120px]">
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-1">Stock</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalStock}</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/10 text-center min-w-[140px]">
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-1">Inventory Value</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">RM {inventoryValue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm sm:rounded-xl overflow-hidden">
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-500" />
                        Store Products ({products.length})
                    </h2>
                </div>
                {products.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>This store has no products yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Price</th>
                                    <th className="px-6 py-3">Stock</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-600 shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{product.name}</p>
                                                    {product.sku && <p className="text-xs text-slate-500">SKU: {product.sku}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
                                                {product.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                            RM {product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.stock <= 0 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                : product.stock < 10 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                                                <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">{product.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
