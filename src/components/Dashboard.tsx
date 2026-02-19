import { useEffect, useState } from 'react';
import { getProducts, getOrders } from '../lib/storage';
import { Product, Order } from '../types';
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import Skeleton from './ui/Skeleton';

export default function Dashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [fetchedProducts, fetchedOrders] = await Promise.all([
                getProducts(),
                getOrders()
            ]);
            setProducts(fetchedProducts);
            setOrders(fetchedOrders);
            setLoading(false);
        };
        loadData();
    }, []);

    const ordersList = Array.isArray(orders) ? orders : [];
    const productsList = Array.isArray(products) ? products : [];

    const totalRevenue = ordersList.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{loading ? <Skeleton width="100px" height="32px" /> : value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color} text-white`}>
                <Icon size={24} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Business Overview</h2>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Revenue" value={`RM ${totalRevenue.toFixed(2)}`} icon={DollarSign} color="bg-emerald-500" />
                <StatCard title="Total Orders" value={ordersList.length} icon={ShoppingBag} color="bg-blue-600" />
                <StatCard title="Active Products" value={productsList.filter(p => p.status === 'active').length} icon={Package} color="bg-orange-500" />
            </div>

            {/* RECENT ORDERS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600" /> Recent Orders
                </h3>

                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center py-3">
                                <div className="space-y-2">
                                    <Skeleton width="120px" height="16px" />
                                    <Skeleton width="80px" height="12px" />
                                </div>
                                <Skeleton width="80px" height="20px" />
                            </div>
                        ))}
                    </div>
                ) : ordersList.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No orders yet.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {ordersList.slice(0, 5).map((order) => (
                            <div key={order.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm">{order.customer_name}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="font-bold text-emerald-600">
                                    RM {(Number(order.total) || 0).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
