import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, updateCartQty, removeFromCart, clearCart } from '../../lib/storage';
import { CartItem } from '../../types';
import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);

    const loadCart = () => setCart(getCart());

    useEffect(() => {
        loadCart();
    }, []);

    const notifyCartUpdate = () => window.dispatchEvent(new Event('cart-updated'));

    const handleQtyChange = (productId: string, delta: number) => {
        const item = cart.find(c => c.product.id === productId);
        if (!item) return;
        const newQty = item.qty + delta;
        if (newQty <= 0) {
            removeFromCart(productId);
        } else {
            updateCartQty(productId, newQty);
        }
        loadCart();
        notifyCartUpdate();
    };

    const handleRemove = (productId: string) => {
        removeFromCart(productId);
        loadCart();
        notifyCartUpdate();
        toast.success('Item removed');
    };

    const handleClear = () => {
        clearCart();
        loadCart();
        notifyCartUpdate();
        toast.success('Cart cleared');
    };

    const total = cart.reduce((sum, c) => sum + c.product.price * c.qty, 0);

    if (cart.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-20 text-center">
                <ShoppingBag className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-6">Browse our products and add your favorites!</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                    <ArrowLeft size={16} /> Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
                <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-700 font-medium transition">Clear Cart</button>
            </div>

            <div className="space-y-4 mb-8">
                {cart.map(item => (
                    <div key={item.product.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                            {item.product.images?.[0] ? (
                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ShoppingBag size={24} />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{item.product.name}</h3>
                            <p className="text-sm text-blue-600 font-medium">RM {item.product.price.toFixed(2)}</p>
                        </div>

                        {/* Qty */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button onClick={() => handleQtyChange(item.product.id, -1)} className="px-3 py-2 text-slate-500 hover:bg-slate-50 transition">
                                <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-bold text-sm">{item.qty}</span>
                            <button onClick={() => handleQtyChange(item.product.id, 1)} className="px-3 py-2 text-slate-500 hover:bg-slate-50 transition">
                                <Plus size={14} />
                            </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right w-24 flex-shrink-0">
                            <p className="font-bold text-slate-900">RM {(item.product.price * item.qty).toFixed(2)}</p>
                        </div>

                        {/* Remove */}
                        <button onClick={() => handleRemove(item.product.id)} className="text-slate-400 hover:text-red-500 transition p-2">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* TOTAL + CHECKOUT */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-medium text-slate-600">Total</span>
                    <span className="text-3xl font-bold text-slate-900">RM {total.toFixed(2)}</span>
                </div>
                <Link
                    to="/checkout"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 transition-all text-center"
                >
                    Proceed to Checkout
                </Link>
                <Link to="/" className="block text-center mt-4 text-sm text-slate-500 hover:text-slate-900 font-medium transition">
                    ← Continue Shopping
                </Link>
            </div>
        </div>
    );
}
