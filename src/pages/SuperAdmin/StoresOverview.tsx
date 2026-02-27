import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Store, Loader2, Search, ExternalLink, Calendar, Package, DollarSign, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { SkeletonTable } from '../../components/ui/Skeleton';

export interface StoreMetrics {
    id: string;
    store_name: string;
    slug: string;
    subdomain?: string;
    created_at: string;
    owner_id: string;
    total_products: number;
    total_stock: number;
    inventory_value: number;
}

export default function StoresOverview() {
    const [stores, setStores] = useState<StoreMetrics[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadStoreMetrics();
    }, []);

    const loadStoreMetrics = async () => {
        try {
            // First fetch stores
            const { data: storesData, error: storesError } = await supabase
                .from('stores')
                .select('*')
                .order('created_at', { ascending: false });

            if (storesError) throw storesError;

            // Then fetch all products (Super Admin RLS allows this)
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('id, store_id, stock, price');

            if (productsError) throw productsError;

            // Aggregate metrics in JS to avoid complex cross-schema RPCs for now
            const metrics: StoreMetrics[] = (storesData || []).map(store => {
                const storeProducts = (productsData || []).filter(p => p.store_id === store.id);
                const total_products = storeProducts.length;
                const total_stock = storeProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
                const inventory_value = storeProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

                return {
                    id: store.id,
                    store_name: store.name,
                    slug: store.slug,
                    subdomain: store.subdomain,
                    created_at: store.created_at,
                    owner_id: store.owner_id,
                    total_products,
                    total_stock,
                    inventory_value
                };
            });

            setStores(metrics);
        } catch (error: any) {
            console.error('Failed to load stores:', error);
            toast.error('Failed to load stores overview data.');
        } finally {
            setLoading(false);
        }
    };

    const filteredStores = stores.filter(
        s => s.store_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.slug?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Store className="w-6 h-6 text-indigo-500" />
                        Stores Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">View and manage all stores across the platform.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search stores..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm sm:rounded-xl">
                {loading ? (
                    <div className="w-full">
                        <SkeletonTable columns={5} rows={5} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Store</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Value</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredStores.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                            <p className="text-lg font-medium text-slate-900 dark:text-white">No stores found</p>
                                            <p className="text-sm mt-1">Try adjusting your search criteria</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStores.map(store => (
                                        <tr key={store.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                                        {store.store_name?.charAt(0)?.toUpperCase() || 'S'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                            {store.store_name}
                                                            <div className="w-2 h-2 rounded-full bg-green-500" title="Active"></div>
                                                        </div>
                                                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                                            /store/{store.slug}
                                                            <a href={`/store/${store.slug}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-600">
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                                                        <Package className="w-4 h-4 text-slate-400" />
                                                        <strong>{store.total_products}</strong> products
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                        <Activity className="w-4 h-4 text-slate-400" />
                                                        {store.total_stock} stock units
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                                                    <DollarSign className="w-4 h-4 text-green-500" />
                                                    RM {store.inventory_value.toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(store.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/super-admin/stores/${store.id}`}
                                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
