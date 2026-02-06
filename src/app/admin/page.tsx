import React from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import TestConnectionButton from '../../components/admin/TestConnectionButton';

export default function DashboardPage() {
    const { data: orders, loading: ordersLoading } = useFirestoreCollection('orders');
    const { data: products, loading: productsLoading } = useFirestoreCollection('products');

    // Calculate Revenue (Mock calculation since order structure might vary)
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);

    const StatCard = ({ title, value, icon: Icon, color, loading }: any) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                {loading ? (
                    <div className="h-8 w-24 bg-slate-100 animate-pulse rounded"></div>
                ) : (
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                )}
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-end">
                <TestConnectionButton />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`RM ${totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    color="bg-green-500"
                    loading={ordersLoading}
                />
                <StatCard
                    title="Total Orders"
                    value={orders.length}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                    loading={ordersLoading}
                />
                <StatCard
                    title="Active Products"
                    value={products.length}
                    icon={Package}
                    color="bg-orange-500"
                    loading={productsLoading}
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        Recent Activity
                    </h3>
                    {ordersLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-50 animate-pulse rounded-lg"></div>)}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">No recent orders found.</div>
                    ) : (
                        <div className="space-y-0 divider-y divide-slate-100">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order.id} className="py-3 flex items-center justify-between border-b border-slate-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">RM 0.00</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
