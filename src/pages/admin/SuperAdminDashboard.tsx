import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, Store as StoreIcon, Activity, ExternalLink, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface StoreClient {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export default function SuperAdminDashboard() {
    const [stores, setStores] = useState<StoreClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            // Because this user is in super_admins, RLS allows selecting all stores
            const { data, error } = await supabase
                .from('stores')
                .select('id, name, slug, created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStores(data || []);
        } catch (err: any) {
            console.error('Failed to load stores:', err);
            toast.error('Failed to load platform data');
        } finally {
            setLoading(false);
        }
    };

    const filteredStores = stores.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.slug && s.slug.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex-1 p-8 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-7 h-7 text-indigo-500" />
                        Platform Super Admin
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all SaaS clients and stores</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <StoreIcon className="w-5 h-5 text-indigo-500" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Stores</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stores.length}</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Activity className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">System Status</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">All Systems Operational</p>
                    </div>
                </div>
            </div>

            {/* Client List */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white">Registered Stores</h2>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search client..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 dark:text-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700/50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                <th className="p-4 pl-6">Store Name</th>
                                <th className="p-4">Storefront URL (Slug)</th>
                                <th className="p-4">Joined Date</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                            {filteredStores.map((store) => (
                                <tr key={store.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="font-medium text-slate-900 dark:text-white">{store.name}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-0.5" title={store.id}>{store.id.slice(0, 8)}...</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs font-mono">
                                                /store/{store.slug}
                                            </span>
                                            <a
                                                href={`${window.location.origin}/store/${store.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-indigo-500 transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            {new Date(store.created_at).toLocaleDateString('en-MY', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredStores.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        No stores found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
