import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, getSettings, getProducts, createOrder, updateProductStock, clearCart } from '../../lib/storage';
import { CartItem, Order, StoreSettings } from '../../types';
import { ChevronLeft, Truck, AlertCircle, Loader2, CreditCard, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import PaymentSection from '../../components/store/PaymentSection';

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

    const handleProcessPayment = async (method: string) => {
        if (!cart.length) return;
        if (!settings) return;

        const form = document.getElementById('checkout-form') as HTMLFormElement;
        if (form && !form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (!fullName || !phone || !address) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!method) {
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
                payment_method: method,
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
            const methodLabel = method === 'bank_transfer' ? 'Bank Transfer' : method === 'duitnow' ? 'DuitNow QR' : method === 'stripe' ? 'Credit/Debit Card' : method === 'toyyibpay' ? 'FPX Banking' : 'Cash on Delivery';
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

            if (method === 'toyyibpay') {
                toast.loading('Redirecting to Bank...');
                // ESOK KITA SAMBUNG SINI: Logic redirect ke ToyyibPay
            } else if (method === 'stripe') {
                toast.loading('Opening Stripe Secure Checkout...');
                // ESOK KITA SAMBUNG SINI: Logic Stripe
            } else {
                navigate(`/order-confirmation?orderId=${newOrder.id}`);
            }

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

                <form id="checkout-form" onSubmit={(e) => e.preventDefault()} className="space-y-6">
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

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        {isSubmitting ? (
                            <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                                <Loader2 className="animate-spin mb-4 text-blue-600" size={32} />
                                <p>Processing your order...</p>
                            </div>
                        ) : (
                            <PaymentSection
                                storeId="1"
                                amount={total}
                                onPay={handleProcessPayment}
                            />
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
