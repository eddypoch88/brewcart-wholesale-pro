import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, getSettings, getProducts, createOrder, updateProductStock, clearCart } from '../../lib/storage';
import { CartItem, Order, StoreSettings } from '../../types';
import { ChevronLeft, Truck, AlertCircle, Loader2, CreditCard, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

type PaymentMethod = 'bank_transfer' | 'duitnow' | 'cod';

const paymentMethods: { id: PaymentMethod; label: string; microcopy: string; icon: any; group: 'instant' | 'other' }[] = [
    { id: 'bank_transfer', label: 'Bank Transfer', microcopy: 'Transfer to our bank account', icon: CreditCard, group: 'instant' },
    { id: 'duitnow', label: 'DuitNow QR', microcopy: 'Scan QR with any banking app', icon: QrCode, group: 'instant' },
    { id: 'cod', label: 'Cash on Delivery', microcopy: 'Pay when your stock arrives', icon: Truck, group: 'other' },
];

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

    const [stockError, setStockError] = useState<string | null>(null);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const init = async () => {
            const currentCart = getCart();
            setCart(currentCart);

            try {
                const [fetchedSettings, fetchedProducts] = await Promise.all([
                    getSettings(),
                    getProducts()
                ]);
                setSettings(fetchedSettings);
                setProducts(fetchedProducts);

                if (currentCart.length === 0) {
                    navigate('/cart');
                    return;
                }

                validateStock(currentCart, fetchedProducts);
            } catch (error) {
                console.error("Failed to load checkout data", error);
                toast.error("Failed to load checkout data");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [navigate]);

    const validateStock = (currentCart: CartItem[], currentProducts: any[]) => {
        for (const item of currentCart) {
            const product = currentProducts.find(p => p.id === item.product.id);
            if (!product) continue;
            if (product.stock < item.qty) {
                setStockError(`${product.name} only has ${product.stock} left in stock. Please update your cart.`);
                return false;
            }
        }
        setStockError(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!cart.length) return;
        if (!settings) return;

        if (!fullName || !phone || !address) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!paymentMethod) {
            toast.error('Please select a payment method');
            return;
        }

        setIsSubmitting(true);

        try {
            const latestProducts = await getProducts();

            if (!validateStock(cart, latestProducts)) {
                setIsSubmitting(false);
                toast.error('Stock issue detected. Please check alert.');
                return;
            }

            const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
            const deliveryFee = subtotal >= (settings.free_delivery_threshold || Infinity) ? 0 : (settings.delivery_fee || 0);
            const total = subtotal + deliveryFee;

            const newOrder: Order = {
                id: `ORD-${Date.now()}`,
                customer_name: fullName,
                customer_phone: phone,
                delivery_address: address,
                customer_notes: notes,
                items: cart.map(item => ({
                    product: item.product,
                    qty: item.qty
                })),
                subtotal,
                delivery_fee: deliveryFee,
                total: total,
                status: 'pending',
                created_at: new Date().toISOString(),
                payment_method: paymentMethod,
                payment_proof: undefined,
                payment_status: 'unpaid'
            };

            const createdOrder = await createOrder(newOrder);

            if (!createdOrder) {
                throw new Error("Failed to create order in database. Check console for details.");
            }

            await updateProductStock(cart.map(item => ({
                product: { id: item.product.id },
                qty: item.qty
            })));

            clearCart();

            const orderReviewLink = `https://brewcart-wholesale-pro.vercel.app/order-review/${newOrder.id}`;

            const itemsList = cart.map(c => `• ${c.product.name} x${c.qty}`).join('\n');
            const methodLabel = paymentMethod === 'bank_transfer' ? 'Bank Transfer' : paymentMethod === 'duitnow' ? 'DuitNow QR' : 'Cash on Delivery';
            const message = `✅ *New Order Received!* \n\n` +
                `*Order ID:* ${newOrder.id}\n` +
                `*Customer:* ${fullName}\n` +
                `*Phone:* ${phone}\n` +
                `*Address:* ${address}\n\n` +
                `*Items:*\n${itemsList}\n\n` +
                `*Total:* RM ${total.toFixed(2)}\n` +
                `*Payment:* ${methodLabel}\n` +
                `*Notes:* ${notes || 'None'}\n\n` +
                `📋 *Order Review Link:*\n${orderReviewLink}\n\n` +
                `Please process this request. Thank you!`;

            const whatsappNumber = settings?.whatsapp_number || '60123456789';
            const adminPhone = whatsappNumber.replace(/[^0-9]/g, '');

            if (adminPhone) {
                window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank');
            }

            navigate(`/order-confirmation?orderId=${newOrder.id}`);

        } catch (error: any) {
            console.error("Order Submission Error:", error);
            toast.error(`Failed to place order: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !settings) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const deliveryFee = subtotal >= (settings.free_delivery_threshold || Infinity) ? 0 : (settings.delivery_fee || 0);
    const total = subtotal + deliveryFee;

    const instantMethods = paymentMethods.filter(m => m.group === 'instant');
    const otherMethods = paymentMethods.filter(m => m.group === 'other');

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-200 sticky top-0 z-10">
                <button onClick={() => navigate('/cart')} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <ChevronLeft size={24} className="text-slate-600" />
                </button>
                <h1 className="text-lg font-bold text-slate-800">Checkout</h1>
            </div>

            <div className="max-w-xl mx-auto p-4 space-y-6">

                {stockError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <p className="text-sm font-medium">{stockError}</p>
                    </div>
                )}

                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800">Order Summary</h2>
                    </div>
                    <div className="p-4 space-y-3">
                        {cart.map((item) => (
                            <div key={item.product.id} className="flex gap-3">
                                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                    {item.product.images?.[0] && <img src={item.product.images[0]} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-slate-900 truncate">{item.product.name}</h3>
                                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-slate-900">RM {(item.product.price * item.qty).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <Truck size={18} className="text-blue-600" />
                            <h2 className="font-bold text-slate-800">Delivery Details</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. 012-3456789"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    rows={3}
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Enter full address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Special Notes (Optional)</label>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Any specific instructions?"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                            <CreditCard size={18} className="text-blue-600" />
                            <h2 className="font-bold text-slate-800">Payment Method</h2>
                        </div>
                        <div className="p-4 space-y-5">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Instant Payment</p>
                                <div className="space-y-3">
                                    {instantMethods.map((method) => {
                                        const Icon = method.icon;
                                        const selected = paymentMethod === method.id;
                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`w-full flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all text-left ${selected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 bg-white'}`}
                                            >
                                                <Icon size={20} className={selected ? 'text-blue-600' : 'text-slate-400'} />
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900">{method.label}</p>
                                                    <p className="text-xs text-slate-500">{method.microcopy}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-blue-600' : 'border-slate-300'}`}>
                                                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Other</p>
                                <div className="space-y-3">
                                    {otherMethods.map((method) => {
                                        const Icon = method.icon;
                                        const selected = paymentMethod === method.id;
                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`w-full flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all text-left ${selected ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 bg-white'}`}
                                            >
                                                <Icon size={20} className={selected ? 'text-blue-600' : 'text-slate-400'} />
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900">{method.label}</p>
                                                    <p className="text-xs text-slate-500">{method.microcopy}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-blue-600' : 'border-slate-300'}`}>
                                                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 md:relative md:shadow-none md:border-t-0 md:bg-transparent md:p-0">
                        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
                            <div>
                                <p className="text-slate-500 text-sm">Total Amount</p>
                                <p className="text-2xl font-bold text-slate-900">RM {total.toFixed(2)}</p>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !!stockError || !paymentMethod}
                                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
