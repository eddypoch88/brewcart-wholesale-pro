import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Phone, User, ShoppingBag, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function OrderList() {
    const { store } = useStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    // 1. TARIK DATA ORDER DARI SUPABASE
    useEffect(() => {
        if (store) fetchOrders();
    }, [store]);

    const fetchOrders = async () => {
        if (!store) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('store_id', store.id) // 🔥 Filter by store
            .order('created_at', { ascending: false }); // Paling baru di atas

        if (error) console.error('Error fetching orders:', error);
        else setOrders(data || []);
        setLoading(false);
    };

    // 2. TOGGLE (BUKA/TUTUP) DETAIL ORDER
    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    // 3. FORMAT TARIKH (BIAR CANTIK)
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-MY', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-400">Loading Orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Order History</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                    {orders.length} Orders
                </span>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Belum ada order masuk bosku. Rilek lu.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">

                            {/* HEADER ORDER (YANG SENTIASA NAMPAK) */}
                            <div
                                className="p-5 flex flex-col md:flex-row justify-between items-center cursor-pointer bg-slate-50/50"
                                onClick={() => toggleExpand(order.id)}
                            >
                                <div className="flex gap-4 items-center w-full md:w-auto mb-4 md:mb-0">
                                    <div className={`p-3 rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {order.customer_name || 'Pelanggan Misteri'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <Clock size={12} /> {formatDate(order.created_at)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Total Amount</p>
                                        <p className="font-bold text-lg text-emerald-600">RM {Number(order.total_amount).toFixed(2)}</p>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>

                                    {expandedOrderId === order.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                </div>
                            </div>

                            {/* DETAIL BARANG (MUNCUL BILA KLIK) */}
                            {expandedOrderId === order.id && (
                                <div className="border-t border-slate-100 p-5 bg-white animate-slide-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* Kiri: Info Customer */}
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                                                <User size={16} /> Customer Details
                                            </h4>
                                            <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                                                <p><span className="text-slate-500 w-20 inline-block">Name:</span> {order.customer_name || '-'}</p>
                                                <p><span className="text-slate-500 w-20 inline-block">Phone:</span>
                                                    <a href={`https://wa.me/${order.customer_phone?.replace(/[^0-9]/g, '')}`} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 inline-flex">
                                                        <Phone size={12} /> {order.customer_phone || '-'}
                                                    </a>
                                                </p>
                                                <p><span className="text-slate-500 w-20 inline-block">Order ID:</span> <span className="font-mono text-xs">{order.id}</span></p>
                                            </div>
                                        </div>

                                        {/* Kanan: Senarai Barang */}
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                                                <ShoppingBag size={16} /> Items Purchased
                                            </h4>
                                            <div className="border border-slate-100 rounded-lg divide-y divide-slate-100">
                                                {order.items && Array.isArray(order.items) ? (
                                                    order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="p-3 flex justify-between items-center">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden">
                                                                    {item.product.images?.[0] && <img src={item.product.images[0]} className="w-full h-full object-cover" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-sm text-slate-800">{item.product.name}</p>
                                                                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                                                                </div>
                                                            </div>
                                                            <span className="font-bold text-sm text-slate-600">RM {(item.product.price * item.qty).toFixed(2)}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="p-3 text-sm text-slate-400">Data barang error (JSON format).</p>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
