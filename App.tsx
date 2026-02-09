import { useEffect, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { ProductService } from './src/services/product.service';
import { supabase } from './src/lib/supabase';
import { Product } from './src/types';
import toast, { Toaster } from 'react-hot-toast'; // <--- 1. IMPORT BARU

// COMPONENTS
import ProductForm from './src/components/ProductForm';
import ProductCard from './src/components/ProductCard';
import Dashboard from './src/components/Dashboard';
import Sidebar from './src/components/Sidebar';
import OrderList from './src/components/OrderList';
import Settings from './src/components/Settings';

export default function App() {
  // STATES
  const [viewMode, setViewMode] = useState<'shop' | 'admin'>('shop');
  const [adminTab, setAdminTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState('BrewCart');

  // CART & CHECKOUT STATES
  const [cart, setCart] = useState<{ product: Product, qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });

  // LOAD DATA
  const loadProducts = async () => {
    setLoading(true);
    const { data } = await ProductService.getAll();
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
    supabase.from('store_config').select('store_name').single()
      .then(({ data }) => {
        if (data && data.store_name) setStoreName(data.store_name);
      });
  }, []);

  // DELETE LOGIC
  const handleDeleteProduct = async (id: string) => {
    // 2. GUNA TOAST UNTUK PROMISE (Loading... Success... Error)
    await toast.promise(
      ProductService.delete(id),
      {
        loading: 'Membuang produk...',
        success: 'Produk berjaya dipadam! 🗑️',
        error: 'Gagal memadam.',
      }
    );
    loadProducts();
  };

  // CART LOGIC
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        toast.success(`Tambah lagi satu ${product.name}! ☕`); // <--- TOAST
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      toast.success(`${product.name} masuk troli! 🛒`); // <--- TOAST
      return [...prev, { product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    toast('Produk dikeluarkan', { icon: '👋' }); // <--- TOAST
  };

  // CHECKOUT LOGIC
  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Troli kosong bos!");

    if (!customerInfo.name || !customerInfo.phone) {
      return toast.error("Sila isi Nama & No. Telefon! 🙏"); // <--- TOAST ERROR
    }

    setIsCheckingOut(true);
    const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

    try {
      const { error } = await supabase.from('orders').insert([
        {
          total_amount: totalAmount,
          status: 'pending',
          items: cart,
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone
        }
      ]);

      if (error) throw error;

      toast.success(`Terima kasih ${customerInfo.name}! Order Berjaya! 🎉`, { duration: 5000 }); // <--- TOAST SUCCESS

      setCart([]);
      setCustomerInfo({ name: '', phone: '' });
      setIsCartOpen(false);

      if (viewMode === 'admin') window.location.reload();

    } catch (err: any) {
      toast.error(`Gagal Checkout: ${err.message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // --- RENDER UTAMA ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* 3. PASANG TOASTER DI SINI (Supaya dia boleh muncul di mana-mana) */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* MODAL TROLI */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag /> Troli Anda</h2>
              <button onClick={() => setIsCartOpen(false)}><X className="text-slate-500" /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {cart.length === 0 ? <p className="text-center text-slate-400 mt-10">Troli kosong.</p> : cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b border-slate-100 pb-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-md overflow-hidden">
                    {item.product.images?.[0] && <img src={item.product.images[0]} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.product.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.qty} x RM {item.product.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 text-xs font-bold">Buang</button>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-3 bg-slate-50 p-4 rounded-xl mb-4">
                <h3 className="font-bold text-sm text-slate-700">Maklumat Penghantaran:</h3>
                <input
                  type="text"
                  placeholder="Nama Penuh (Cth: Eddy Poch)"
                  className="w-full border p-2 rounded-lg text-sm"
                  value={customerInfo.name}
                  onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="No. Telefon (Cth: 012-3456789)"
                  className="w-full border p-2 rounded-lg text-sm"
                  value={customerInfo.phone}
                  onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                />
              </div>
            )}

            {cart.length > 0 && (
              <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full bg-black text-white py-3 rounded-xl font-bold mt-2 hover:bg-slate-800 disabled:opacity-50 transition">
                {isCheckingOut ? 'Processing...' : `Bayar RM ${cart.reduce((a, c) => a + (c.product.price * c.qty), 0).toFixed(2)}`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- LOGIC VIEW: ADMIN vs SHOP --- */}
      {viewMode === 'admin' ? (
        <div className="flex min-h-screen bg-slate-100">
          <Sidebar activeTab={adminTab} setActiveTab={setAdminTab} onLogout={() => setViewMode('shop')} storeName={storeName} />
          <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
            {adminTab === 'dashboard' && <div className="animate-fade-in"><Dashboard /></div>}

            {adminTab === 'products' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Product Management</h1>
                  <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition">+ Add Product</button>
                </div>
                {isEditing ? (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <ProductForm onSuccess={() => { setIsEditing(false); loadProducts(); }} onCancel={() => setIsEditing(false)} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(p => (
                      <ProductCard key={p.id} product={p} isAdmin={true} onAddToCart={() => { }} onEdit={() => setIsEditing(true)} onDelete={handleDeleteProduct} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {adminTab === 'orders' && <div className="animate-fade-in"><OrderList /></div>}
            {adminTab === 'settings' && <div className="animate-fade-in"><Settings /></div>}
          </div>
        </div>
      ) : (
        <div className="pb-20">
          <nav className="bg-white sticky top-0 z-30 px-6 py-4 shadow-sm flex justify-between items-center">
            <div className="font-bold text-xl flex items-center gap-2">
              <div className="bg-black text-white px-2 rounded">BC</div> {storeName}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setViewMode('admin')} className="text-sm font-bold text-slate-500 hover:text-black">Admin Login</button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>}
              </button>
            </div>
          </nav>

          <div className="bg-black text-white text-center py-16 px-6 mb-10">
            <h1 className="text-4xl font-extrabold mb-4">Quality Coffee, Delivered.</h1>
            <p className="text-slate-400 max-w-xl mx-auto">Rasa kopi sebenar dari ladang Sabah.</p>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.filter(p => p.status === 'active').map(p => (
              <ProductCard key={p.id} product={p} isAdmin={false} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}