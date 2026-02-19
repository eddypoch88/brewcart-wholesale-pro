import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, getSettings, getProducts, createOrder, updateProductStock, clearCart } from '../../lib/storage';
import { CartItem, Order, StoreSettings } from '../../types';
import { ChevronLeft, Truck, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');


    // Validation State
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

                // Initial stock check
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

        // 1. Basic Validation
        if (!fullName || !phone || !address) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // Fetch latest products for stock validation
            const latestProducts = await getProducts();

            // 2. Final Stock Validation
            if (!validateStock(cart, latestProducts)) {
                setIsSubmitting(false);
                toast.error('Stock issue detected. Please check alert.');
                return;
            }

            // 3. Calculate Totals
            const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
            const deliveryFee = subtotal >= (settings.free_delivery_threshold || Infinity) ? 0 : (settings.delivery_fee || 0);
            const total = subtotal + deliveryFee;

            // 4. Create Order Object
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
                payment_method: 'pending',
                payment_proof: undefined,
                payment_status: 'unpaid'
            };

            // 5. Save Order & Deduct Stock
            const createdOrder = await createOrder(newOrder); // Async create

            if (!createdOrder) {
                throw new Error("Failed to create order in database. Check console for details.");
            }

            // Deduct stock
            await updateProductStock(cart.map(item => ({
                product: { id: item.product.id },
                qty: item.qty
            })));

            clearCart();

            // 6. Send WhatsApp Notification
            // Generate link for Order Review (New requirement)
            const orderReviewLink = `https://brewcart-wholesale-pro.vercel.app/order-review/${newOrder.id}`;

            const itemsList = cart.map(c => `• ${c.product.name} x${c.qty}`).join('\n');
            const message = `✅ *New Order Received!* \n\n` +
                `*Order ID:* ${newOrder.id}\n` +
                `*Customer:* ${fullName}\n` +
                `*Phone:* ${phone}\n` +
                `*Address:* ${address}\n\n` +
                `*Items:*\n${itemsList}\n\n` +
                `*Total:* RM ${total.toFixed(2)}\n` +
                `*Notes:* ${notes || 'None'}\n\n` +
                `📋 *Order Review Link:*\n${orderReviewLink}\n\n` +
                `Please process this request. Thank you!`;

            // Default fallback if settings is missing/empty
            const whatsappNumber = settings?.whatsapp_number || '60123456789';
            const adminPhone = whatsappNumber.replace(/[^0-9]/g, '');

            if (adminPhone) {
                window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank');
            }

            // 7. Redirect to Confirmation (or maybe just show success and clear?)
            navigate(`/order-confirmation?orderId=${newOrder.id}`);

        } catch (error: any) {
            console.error("Order Submission Error:", error);
            // Show specific error if available
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
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-slate-200 sticky top-0 z-10">
                <button onClick={() => navigate('/cart')} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <ChevronLeft size={24} className="text-slate-600" />
                </button>
                <h1 className="text-lg font-bold text-slate-800">Checkout</h1>
            </div>

            <div className="max-w-xl mx-auto p-4 space-y-6">

                {/* Stock Alert */}
                {stockError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700 animate-in fade-in">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <p className="text-sm font-medium">{stockError}</p>
                    </div>
                )}

                {/* Order Summary */}
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
                    {/* Customer Details */}
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



                    {/* Place Order Button */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 md:relative md:shadow-none md:border-t-0 md:bg-transparent md:p-0">
                        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
                            <div>
                                <p className="text-slate-500 text-sm">Total Amount</p>
                                <p className="text-2xl font-bold text-slate-900">RM {total.toFixed(2)}</p>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !!stockError}
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
