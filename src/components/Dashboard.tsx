import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Kita guna direct connection utk order
import { ProductService } from '../services/product.service'; // Guna otak yang kita dah buat
import { Package, ShoppingBag, DollarSign, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // LOAD DATA
    useEffect(() => {
        async function loadData() {
            setLoading(true);

            // 1. Ambil Produk guna Service
            const { data: prodData } = await ProductService.getAll();
            if (prodData) setProducts(prodData);

            // 2. Ambil Order (Kita buat manual sini sebab Service Order belum ada)
            const { data: orderData } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (orderData) setOrders(orderData);

            setLoading(false);
        }
        loadData();
    }, []);

    // SAFETY CHECK (Airbag)
    const safeOrders = orders || [];
    const safeProducts = products || [];

    // KIRA TOTAL REVENUE
    const totalRevenue = safeOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

    // KOMPONEN KAD KECIL
    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{loading ? '...' : value}</h3>
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
                <StatCard title="Total Orders" value={safeOrders.length} icon={ShoppingBag} color="bg-blue-600" />
                <StatCard title="Active Products" value={safeProducts.length} icon={Package} color="bg-orange-500" />
            </div>

            {/* RECENT ORDERS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600" /> Recent Orders
                </h3>

                {loading ? (
                    <div className="animate-pulse h-20 bg-slate-50 rounded"></div>
                ) : safeOrders.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">Tiada order lagi.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {safeOrders.slice(0, 5).map((order) => (
                            <div key={order.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm">Order #{order.id.substring(0, 6)}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="font-bold text-emerald-600">
                                    RM {Number(order.total_amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
