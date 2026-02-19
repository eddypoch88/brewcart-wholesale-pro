import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { getSettings, getOrders } from '../../lib/storage';

export default function OrderConfirmationPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [settings, setSettings] = useState<any>(null);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [fetchedSettings, fetchedOrders] = await Promise.all([
                getSettings(),
                getOrders()
            ]);
            setSettings(fetchedSettings);
            const foundOrder = fetchedOrders.find((o: any) => o.id === orderId);
            setOrder(foundOrder);
            setLoading(false);
        };
        loadData();
    }, [orderId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    const handleChat = () => {
        if (!settings?.whatsapp_number) return;
        window.open(`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="text-green-600 w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Order Confirmed!</h1>
                    <p className="text-slate-600">
                        We have received your order. We will contact you at <span className="font-semibold text-slate-900">{order?.customer_phone || 'your number'}</span> soon.
                    </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-sm text-slate-500 uppercase font-semibold tracking-wider mb-1">Order ID</p>
                    <p className="text-xl font-mono font-bold text-slate-900 tracking-wide">{orderId || 'Unknown'}</p>
                </div>

                {order?.payment_method === 'bank_transfer' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 flex gap-3 text-left">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <p>
                            <strong>Payment Proof Required:</strong><br />
                            Please send your payment receipt to our WhatsApp number now to complete your order.
                        </p>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    <button
                        onClick={handleChat}
                        className="w-full bg-white border border-slate-200 text-slate-700 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <MessageSquare size={18} className="text-green-600" />
                        Chat with Us
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                    >
                        <ShoppingBag size={18} />
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
