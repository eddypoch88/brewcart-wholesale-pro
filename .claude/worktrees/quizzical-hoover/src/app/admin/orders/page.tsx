import React from 'react';
import { useSupabaseCollection } from '../../../hooks/useSupabase';
import { ChevronRight, Package, Clock, User } from 'lucide-react';
import { Order } from '@/src/shared/shared-types';

export default function OrdersPage() {
    const { data: orders, loading } = useSupabaseCollection<Order>('orders');

    // Mobile Order Card
    const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-4">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-900">#{order.order_number}</span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
            ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'}`}>
                    {order.status || 'Pending'}
                </span>
            </div>
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-slate-500 gap-2">
                    <Clock size={14} />
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Just now'}
                </div>
                <div className="flex items-center text-xs text-slate-500 gap-2">
                    <User size={14} />
                    {order.customer_name || 'Guest Customer'}
                </div>
                <div className="flex items-center text-xs text-slate-500 gap-2">
                    <Package size={14} />
                    {(Array.isArray(order.items) ? order.items.length : 0)} Items
                </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-900">RM {order.total_amount?.toFixed(2) || '0.00'}</span>
                <button className="text-blue-600 text-sm font-semibold flex items-center hover:underline">
                    Details <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
                <div className="text-sm text-slate-500">
                    Total of <span className="font-bold text-slate-900">{orders.length}</span> orders
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl"></div>)}
                </div>
            ) : (
                <>
                    {/* Mobile View */}
                    <div className="md:hidden">
                        {orders.map((order) => <OrderCard key={order.id} order={order} />)}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-slate-600">#{order.order_number}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Just now'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.customer_name || 'Guest'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${order.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                    order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                        'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">RM {order.total_amount?.toFixed(2) || '0.00'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                                <ChevronRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
