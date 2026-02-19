import { useEffect, useState } from 'react';
import { Calendar, Phone, User, ShoppingBag, ChevronDown, ChevronUp, Clock, Search, Download, Printer, MapPin, CreditCard, FileText, Save, Trash2, CheckSquare, Square } from 'lucide-react';
import { getOrders, updateOrderStatus, updateOrderNotes, getSettings, deleteOrders } from '../lib/storage';
import { Order } from '../types';
import { DEFAULT_SETTINGS } from '../data/mockData';
import toast from 'react-hot-toast';
import OrderStatusDropdown from './ui/OrderStatusDropdown';

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());
    const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
    const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
    const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);
    const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [fetchedOrders, fetchedSettings] = await Promise.all([
                getOrders(),
                getSettings()
            ]);
            setOrders(fetchedOrders);
            setSettings(fetchedSettings);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        setUpdatingOrderId(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedOrderIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleSelectOrder = (id: string) => {
        setSelectedOrderIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = (filteredIds: string[]) => {
        if (filteredIds.every(id => selectedOrderIds.has(id))) {
            // Deselect all
            setSelectedOrderIds(prev => {
                const newSet = new Set(prev);
                filteredIds.forEach(id => newSet.delete(id));
                return newSet;
            });
        } else {
            // Select all
            setSelectedOrderIds(prev => {
                const newSet = new Set(prev);
                filteredIds.forEach(id => newSet.add(id));
                return newSet;
            });
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedOrderIds.size === 0) return;

        if (window.confirm(`Delete ${selectedOrderIds.size} selected orders? This cannot be undone.`)) {
            const idsToDelete: string[] = Array.from(selectedOrderIds);
            try {
                await deleteOrders(idsToDelete);

                // Update local state
                setOrders(prev => prev.filter(o => !selectedOrderIds.has(o.id)));
                setSelectedOrderIds(new Set());
                toast.success(`Deleted ${idsToDelete.length} orders`);
            } catch (error) {
                toast.error("Failed to delete orders");
            }
        }
    };

    const handleSaveNotes = async (orderId: string) => {
        const notes = editingNotes[orderId] || '';
        try {
            await updateOrderNotes(orderId, notes);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, admin_notes: notes } : o));
            toast.success('Note saved!');
        } catch (error) {
            toast.error("Failed to save note");
        }
    };

    const handlePrint = (order: Order) => {
        setOrderToPrint(order);
        setTimeout(() => {
            window.print();
            setOrderToPrint(null);
        }, 100);
    };

    const exportToCSV = () => {
        const headers = ['Order ID', 'Customer', 'Phone', 'Date', 'Items', 'Total', 'Status'];
        const rows = filteredOrders.map(order => [
            order.id,
            order.customer_name,
            order.customer_phone,
            formatDate(order.created_at),
            order.items?.map(i => `${i.product.name} (x${i.qty})`).join('; ') || '',
            `RM ${order.total_amount.toFixed(2)}`,
            order.status
        ]);
        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `brewcart-orders-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('CSV exported successfully!');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-MY', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    // Filter by status, search, and date range
    let filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
            order.customer_name?.toLowerCase().includes(q) ||
            order.customer_phone?.includes(searchQuery)
        );
    };

    if (dateFrom) {
        filteredOrders = filteredOrders.filter(order => new Date(order.created_at) >= new Date(dateFrom));
    }
    if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filteredOrders = filteredOrders.filter(order => new Date(order.created_at) <= endDate);
    }

    const filteredIds = filteredOrders.map(o => o.id);
    const isAllSelected = filteredOrders.length > 0 && filteredIds.every(id => selectedOrderIds.has(id));

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-400">Loading Orders...</div>;

    const statusTabs: Array<{ label: string; value: Order['status'] | 'all' }> = [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
    ];



    return (
        <>
            {/* PRINT RECEIPT (hidden, only shows when printing) */}
            {orderToPrint && (
                <div className="print-only hidden">
                    <div className="max-w-2xl mx-auto p-8 bg-white">
                        <div className="text-center mb-6 border-b-2 border-slate-900 pb-4">
                            <h1 className="text-3xl font-bold text-slate-900">{settings.store_name}</h1>
                            <p className="text-sm text-slate-600 mt-1">Order Receipt</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <p className="font-bold text-slate-700">Order ID:</p>
                                <p className="font-mono text-xs">{orderToPrint.id}</p>
                            </div>
                            <div>
                                <p className="font-bold text-slate-700">Date:</p>
                                <p>{formatDate(orderToPrint.created_at)}</p>
                            </div>
                            <div>
                                <p className="font-bold text-slate-700">Customer:</p>
                                <p>{orderToPrint.customer_name}</p>
                            </div>
                            <div>
                                <p className="font-bold text-slate-700">Phone:</p>
                                <p>{orderToPrint.customer_phone}</p>
                            </div>
                        </div>

                        {orderToPrint.delivery_address && (
                            <div className="mb-6 text-sm">
                                <p className="font-bold text-slate-700">Delivery Address:</p>
                                <p className="text-slate-600">{orderToPrint.delivery_address}</p>
                            </div>
                        )}

                        <table className="w-full mb-6 border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-900">
                                    <th className="text-left py-2 font-bold">Item</th>
                                    <th className="text-center py-2 font-bold">Qty</th>
                                    <th className="text-right py-2 font-bold">Price</th>
                                    <th className="text-right py-2 font-bold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderToPrint.items?.map((item, idx) => (
                                    <tr key={idx} className="border-b border-slate-200">
                                        <td className="py-2">{item.product.name}</td>
                                        <td className="text-center py-2">{item.qty}</td>
                                        <td className="text-right py-2">RM {item.product.price.toFixed(2)}</td>
                                        <td className="text-right py-2">RM {(item.product.price * item.qty).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="border-t-2 border-slate-900 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>RM {orderToPrint.total_amount.toFixed(2)}</span>
                            </div>
                            {orderToPrint.payment_method && (
                                <div className="flex justify-between text-slate-600">
                                    <span>Payment Method:</span>
                                    <span>{orderToPrint.payment_method}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-slate-600">
                                <span>Status:</span>
                                <span className="capitalize">{orderToPrint.status}</span>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-200 pt-4">
                            <p>Thank you for your order!</p>
                            <p>{settings.whatsapp_number}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT (hidden when printing) */}
            <div className="space-y-6 no-print">
                {/* HEADER WITH SEARCH & EXPORT */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Order History</h2>
                        <span className="text-sm text-slate-500">{filteredOrders.length} orders</span>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        {selectedOrderIds.size > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                            >
                                <Trash2 size={18} />
                                <span className="hidden sm:inline">Delete ({selectedOrderIds.size})</span>
                            </button>
                        )}
                        <button
                            onClick={exportToCSV}
                            disabled={filteredOrders.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* STATUS FILTER TABS */}
                <div className="flex gap-2 overflow-x-auto pb-2">
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

                {/* DATE RANGE FILTER & SELECT ALL */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleSelectAll(filteredIds)}
                            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                            {isAllSelected ? (
                                <CheckSquare size={20} className="text-blue-600" />
                            ) : (
                                <Square size={20} className="text-slate-400" />
                            )}
                            Select All
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Calendar size={18} className="text-slate-400" />
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-700">From:</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-700">To:</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        {(dateFrom || dateTo) && (
                            <button
                                onClick={() => {
                                    setDateFrom('');
                                    setDateTo('');
                                }}
                                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No orders found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow ${selectedOrderIds.has(order.id) ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200'}`}>

                                {/* HEADER */}
                                <div
                                    className="p-5 flex flex-col md:flex-row justify-between items-center cursor-pointer bg-slate-50/50"
                                    onClick={() => toggleExpand(order.id)}
                                >
                                    <div className="flex gap-4 items-center w-full md:w-auto mb-4 md:mb-0">
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSelectOrder(order.id);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {selectedOrderIds.has(order.id) ? (
                                                <CheckSquare size={20} className="text-blue-600" />
                                            ) : (
                                                <Square size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div className={`p-3 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{order.customer_name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <Clock size={12} /> {formatDate(order.created_at)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500">Total Amount</p>
                                            <p className="font-bold text-lg text-emerald-600">
                                                RM {(Number(order.total) || 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePrint(order);
                                            }}
                                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Print Receipt"
                                        >
                                            <Printer size={18} />
                                        </button>
                                        <OrderStatusDropdown
                                            currentStatus={order.status}
                                            orderId={order.id}
                                            onStatusChange={handleStatusChange}
                                            isUpdating={updatingOrderId === order.id}
                                        />
                                        {expandedOrderIds.has(order.id) ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                    </div>
                                </div>

                                {/* DETAIL */}
                                {expandedOrderIds.has(order.id) && (
                                    <div className="border-t border-slate-100 p-5 bg-white">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* LEFT COLUMN */}
                                            <div className="space-y-6">
                                                {/* Customer Details */}
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                                                        <User size={16} /> Customer Details
                                                    </h4>
                                                    <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                                                        <p><span className="text-slate-500 w-20 inline-block">Name:</span> {order.customer_name}</p>
                                                        <p><span className="text-slate-500 w-20 inline-block">Phone:</span>
                                                            <a href={`https://wa.me/${order.customer_phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                                                                <Phone size={12} /> {order.customer_phone}
                                                            </a>
                                                        </p>
                                                        <p><span className="text-slate-500 w-20 inline-block">Order ID:</span> <span className="font-mono text-xs">{order.id}</span></p>
                                                    </div>
                                                </div>

                                                {/* Delivery Address */}
                                                {order.delivery_address && (
                                                    <div>
                                                        <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                                                            <MapPin size={16} /> Delivery Address
                                                        </h4>
                                                        <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700">
                                                            {order.delivery_address}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Payment Method */}
                                                {order.payment_method && (
                                                    <div>
                                                        <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                                                            <CreditCard size={16} /> Payment Method
                                                        </h4>
                                                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                            {order.payment_method}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Customer Notes */}
                                                {order.customer_notes && (
                                                    <div>
                                                        <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                                                            <FileText size={16} /> Customer Notes
                                                        </h4>
                                                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm text-slate-700">
                                                            {order.customer_notes}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* RIGHT COLUMN */}
                                            <div className="space-y-6">
                                                {/* Items Purchased */}
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
                                                                            {item.product.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-sm text-slate-800">{item.product.name}</p>
                                                                            <p className="text-xs text-slate-500">Qty: {item.qty} × RM {item.product.price.toFixed(2)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="font-bold text-sm text-slate-600">RM {(item.product.price * item.qty).toFixed(2)}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="p-3 text-sm text-slate-400">No item data available.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Admin Notes */}
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                                                        <FileText size={16} /> Admin Notes
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <textarea
                                                            value={editingNotes[order.id] ?? order.admin_notes ?? ''}
                                                            onChange={(e) => setEditingNotes({ ...editingNotes, [order.id]: e.target.value })}
                                                            placeholder="Add internal notes (e.g., 'Called customer, out for delivery')"
                                                            className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                            rows={3}
                                                        />
                                                        <button
                                                            onClick={() => handleSaveNotes(order.id)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                                                        >
                                                            <Save size={16} />
                                                            Save Note
                                                        </button>
                                                    </div>
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
        </>
    );
}
