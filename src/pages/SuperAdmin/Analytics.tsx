import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Loader2, Activity, Store, Package, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { SkeletonCard } from '../../components/ui/Skeleton';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9'];

interface AnalyticsData {
    totalStores: number;
    totalProducts: number;
    totalStockUnits: number;
    totalPlatformValue: number;
    storeData: any[];
    growthData: any[];
}

export default function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            // Fetch stores
            const { data: storesData, error: storesError } = await supabase
                .from('stores')
                .select('id, name, created_at')
                .order('created_at', { ascending: true });

            if (storesError) throw storesError;

            // Fetch products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('id, store_id, stock, price');

            if (productsError) throw productsError;

            let totalProducts = 0;
            let totalStockUnits = 0;
            let totalPlatformValue = 0;
            const storeData: any[] = [];

            // Aggregate data per store
            (storesData || []).forEach(store => {
                const storeProducts = (productsData || []).filter(p => p.store_id === store.id);
                const productsCount = storeProducts.length;
                const stockCount = storeProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
                const value = storeProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

                totalProducts += productsCount;
                totalStockUnits += stockCount;
                totalPlatformValue += value;

                storeData.push({
                    name: store.name,
                    products: productsCount,
                    value: value,
                    stock: stockCount
                });
            });

            // Growth Data over time (Cumulative generic line logic)
            // Just mapping out the creation dates for the stores to show growth
            let cumulativeStores = 0;
            const growthData = (storesData || []).map(store => {
                cumulativeStores += 1;
                return {
                    date: new Date(store.created_at).toLocaleDateString(),
                    stores: cumulativeStores
                };
            });

            setData({
                totalStores: storesData?.length || 0,
                totalProducts,
                totalStockUnits,
                totalPlatformValue,
                storeData,
                growthData
            });

        } catch (error: any) {
            console.error('Failed to load analytics:', error);
            toast.error('Failed to load analytics platform data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonCard className="h-[400px]" />
                    <SkeletonCard className="h-[400px]" />
                    <SkeletonCard className="h-[400px] lg:col-span-2" />
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="w-6 h-6 text-indigo-500" />
                        Platform Analytics
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Cross-tenant overview of all stores and products.</p>
                </div>
            </div>

            {/* Top Level KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Stores</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.totalStores}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                            <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Products</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.totalProducts}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Stock Units</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.totalStockUnits}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Platform Value</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">RM {data.totalPlatformValue.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            {/* Charts View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Products by Store */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Products by Store</h3>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.storeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="products" name="Products Count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Inventory Value by Store Pie */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Inventory Value Distribution</h3>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.storeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {data.storeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => `RM ${value.toFixed(2)}`}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Store Growth Line Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 lg:col-span-2 min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Store Growth Over Time</h3>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.growthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="stores" name="Cumulative Stores" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
