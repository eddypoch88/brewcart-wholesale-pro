import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrders, getSettings, updateOrderPaymentMethod } from '../../lib/storage'; // You might need to export getOrder(id) or just use getOrders().find
import { Order, StoreSettings } from '../../types';
import { Loader2, CheckCircle, AlertCircle, Copy, MessageSquare, CreditCard, Wallet, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderReviewPage() {
    const { orderId } = useParams(); // /order-review/:orderId
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!orderId) return;
            try {
                // Ideally getOrder(id) but getOrders().find works for now if RLS allows or we are admin/public? 
                // Wait, public users shouldn't create "getOrders()" that returns ALL orders.
                // But for now we are checking functionality.
                // BETTER: Implement getOrder(id) in storage.ts to fetch single order by ID safely.
                // Assuming getOrders() is what we have.
                const allOrders = await getOrders();
                const found = allOrders.find(o => o.id === orderId);
                const sett = await getSettings();

                if (found) setOrder(found);
                setSettings(sett);
            } catch (e) {
                console.error(e);
                toast.error("Failed to load order");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [orderId]);

    const handleConfirmPayment = async () => {
        if (!order || !paymentMethod) return;
        setSubmitting(true);
        try {
            await updateOrderPaymentMethod(order.id, paymentMethod);

            // Optimistic update
            setOrder({ ...order, payment_method: paymentMethod });
            toast.success("Payment method confirmed!");

            // Maybe notify admin via WhatsApp again?
        } catch (error) {
            console.error(error);
            toast.error("Failed to update payment method");
        } finally {
            setSubmitting(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" /></div>;
    if (!order || !settings) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Order not found</div>;

    const isPendingPayment = order.payment_method === 'pending';

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Review</h1>
                    <p className="text-slate-500 text-sm">Order ID: <span className="font-mono text-slate-700">{order.id}</span></p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        {order.status}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Truck size={18} /> Delivery Details
                        </h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p><span className="font-medium text-slate-900">Name:</span> {order.customer_name}</p>
                            <p><span className="font-medium text-slate-900">Phone:</span> {order.customer_phone}</p>
                            <p><span className="font-medium text-slate-900">Address:</span><br />{order.delivery_address}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Wallet size={18} /> Payment Status
                        </h3>
                        <div className="space-y-3">
                            {isPendingPayment ? (
                                <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm flex items-start gap-2">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <span>Please select a payment method below to confirm your order.</span>
                                </div>
                            ) : (
                                <div className="p-3 bg-green-50 text-green-800 rounded-lg text-sm flex items-start gap-2">
                                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                                    <span>Payment method selected: <strong>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</strong></span>
                                </div>
                            )}
                            <p className="text-sm text-slate-500">Total Amount</p>
                            <p className="text-2xl font-bold text-emerald-600">RM {(order.total || 0).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">
                        Order Items
                    </div>
                    <div className="divide-y divide-slate-100">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                                        {item.product.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-slate-900">{item.product.name}</p>
                                        <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                                    </div>
                                </div>
                                <span className="font-medium text-slate-900">RM {((item.product.price * item.qty) || 0).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-sm">
                        <span className="text-slate-500">Total</span>
                        <span className="font-bold text-slate-900">RM {(order.total || 0).toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Selection (Only if pending) */}
                {isPendingPayment && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard size={18} /> Select Payment Method
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    className="sr-only"
                                    checked={paymentMethod === 'bank_transfer'}
                                    onChange={() => setPaymentMethod('bank_transfer')}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-900">Bank Transfer / QR Pay</span>
                                        <CreditCard size={20} className="text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-500">Transfer directly to our bank account</p>
                                </div>
                            </label>

                            <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300'}`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    className="sr-only"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-slate-900">Cash on Delivery (COD)</span>
                                        <Truck size={20} className="text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-500">Pay when you receive the goods</p>
                                </div>
                            </label>
                        </div>

                        {paymentMethod === 'bank_transfer' && (
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Bank Details</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-500">Bank Name</p>
                                            <p className="font-bold text-sm text-slate-900">{settings.bank_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-500">Account Number</p>
                                            <p className="font-bold text-sm text-slate-900 font-mono">{settings.bank_account_number}</p>
                                        </div>
                                        <button onClick={() => copyToClipboard(settings.bank_account_number)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-500">Account Holder</p>
                                            <p className="font-bold text-sm text-slate-900">{settings.bank_holder_name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleConfirmPayment}
                            disabled={submitting || !paymentMethod}
                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                            Confirm Payment Method
                        </button>
                    </div>
                )}

                {/* Footer Action */}
                {!isPendingPayment && (
                    <div className="text-center pt-8">
                        <p className="text-slate-500 text-sm mb-4">Need help?</p>
                        <button
                            onClick={() => window.open(`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`, '_blank')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <MessageSquare size={18} className="text-green-600" />
                            Contact Support
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
