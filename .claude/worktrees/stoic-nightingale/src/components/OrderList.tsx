import React, { useEffect, useState } from 'react';
import { Calendar, Phone, User, ShoppingBag, ChevronDown, ChevronUp, Clock, Search, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderService } from '../services/order.service';
import { Order } from '../types';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import OrderStatusDropdown from './ui/OrderStatusDropdown';

export default function OrderList() {
    const { store } = useStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    // 1. TARIK DATA ORDER DARI SUPABASE (USING SERVICE)
    useEffect(() => {
        if (store) fetchOrders();
    }, [store, statusFilter]);

    const fetchOrders = async () => {
        if (!store) return;
        setLoading(true);
        try {
            const { data, error } = statusFilter === 'all'
                ? await OrderService.getAll(store.id)
                : await OrderService.getByStatus(store.id, statusFilter);

            if (error) throw error;
            setOrders(data || []);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    // 2. SEARCH HANDLER
    const handleSearch = async () => {
        if (!store || !searchQuery.trim()) {
            fetchOrders();
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await OrderService.search(store.id, searchQuery);
            if (error) throw error;
            setOrders(data || []);
        } catch (error: any) {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    // 3. STATUS UPDATE HANDLER
    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        if (!store) return;
        setUpdatingOrderId(orderId);

        // Optimistic UI update
        const previousOrders = [...orders];
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        try {
            const { error } = await OrderService.updateStatus(orderId, store.id, newStatus);
            if (error) throw error;
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error: any) {
            // Rollback on error
            setOrders(previousOrders);
            toast.error('Failed to update status');
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // 4. REAL-TIME ORDER UPDATES
    useEffect(() => {
        if (!store) return;

        const subscription = supabase
            .channel(`orders:${store.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                    filter: `store_id=eq.${store.id}`
                },
                (payload) => {
                    toast.success('🎉 New order received!');
                    setOrders(prev => [payload.new as Order, ...prev]);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `store_id=eq.${store.id}`
                },
                (payload) => {
                    setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new as Order : o));
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [store]);

    // 4. TOGGLE (BUKA/TUTUP) DETAIL ORDER
    const toggleExpand = (id: string) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    // 5. FORMAT TARIKH (BIAR CANTIK)
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-MY', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // 6. FILTER ORDERS BY SEARCH QUERY (CLIENT-SIDE)
    const filteredOrders = searchQuery.trim()
        ? orders.filter(order =>
            order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer_phone?.includes(searchQuery)
        )
        : orders;

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-400">Loading Orders...</div>;

    const statusTabs: Array<{ label: string; value: Order['status'] | 'all'; count?: number }> = [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
    ];

    return (
        <div className="space-y-6">
            {/* HEADER WITH SEARCH */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Order History</h2>
                    <span className="text-sm text-slate-500">{filteredOrders.length} orders</span>
                </div>

                {/* SEARCH BAR */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* STATUS FILTER TABS */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {statusTabs.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${statusFilter === tab.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {filteredOrders.length === 0 ? (
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

                                    {/* Status Dropdown */}
                                    <OrderStatusDropdown
                                        currentStatus={order.status}
                                        orderId={order.id}
                                        onStatusChange={handleStatusChange}
                                        isUpdating={updatingOrderId === order.id}
                                    />

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
