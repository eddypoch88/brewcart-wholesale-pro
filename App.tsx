import React, { useState, useEffect } from 'react';
import { storeConfig } from './src/config/store';
import Storefront from './components/Storefront';
import ProductPage from './src/app/product/[id]/page';
import ConnectionStatus from './components/ConnectionStatus';
import { ArrowLeft } from 'lucide-react';

// New Admin Components
import AdminLayout from './src/app/admin/layout';
import DashboardPage from './src/app/admin/page';
import OrdersPage from './src/app/admin/orders/page';
import AddProductPage from './src/app/admin/products/new/page';
import SettingsPage from './src/app/admin/settings/page';

const INITIAL_ITEMS = [
  { id: 1, name: 'Premium Product A', price: 'RM 145.00', stock: 500, status: 'In Stock', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500&h=500', description: 'High quality premium item, box of 24.' },
  { id: 2, name: 'Standard Product B', price: 'RM 180.00', stock: 1200, status: 'In Stock', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500&h=500', description: 'Essential daily item, durable.' },
  { id: 3, name: 'Luxury Item C', price: 'RM 155.00', stock: 800, status: 'In Stock', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500&h=500', description: 'Limited edition luxury good.' },
  { id: 4, name: 'Basic Item D', price: 'RM 135.00', stock: 600, status: 'In Stock', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=500&h=500', description: 'Basic necessity, bulk pack.' },
  { id: 5, name: 'Imported Goods E', price: 'RM 190.00', stock: 45, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281e960?auto=format&fit=crop&q=80&w=500&h=500', description: 'Imported specialty item.' },
];

function App() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [viewMode, setViewMode] = useState<'admin' | 'shop' | 'product'>('admin');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setViewMode('product');
    window.history.pushState({ view: 'product', product }, '', '#product');
  };

  // --- HISTORY MANAGEMENT ---
  useEffect(() => {
    // Initial State Replace
    window.history.replaceState({ view: 'admin', product: null }, '', '#admin');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setViewMode(event.state.view || 'admin');
        setSelectedProduct(event.state.product || null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // New Admin Navigation State
  const [adminPage, setAdminPage] = useState('dashboard');

  // --- VIEW 1: CUSTOMER STOREFRONT (SHOP) ---
  if (viewMode === 'shop') {
    return (
      <div className="min-h-screen bg-slate-50 relative font-sans" style={{ '--primary': storeConfig.primaryColor, '--secondary': storeConfig.secondaryColor } as React.CSSProperties}>
        <ConnectionStatus />
        {/* Sync: Pass 'items' as 'products' to match Storefront's expected prop */}
        <Storefront products={items} onProductClick={handleProductClick} />

        <button
          onClick={() => {
            setViewMode('admin');
            window.history.pushState({ view: 'admin', product: null }, '', '#admin');
          }}
          className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 z-50 hover:scale-110 transition-transform border-2 border-white/20"
        >
          <ArrowLeft size={20} /> Back to Admin
        </button>
      </div>
    );
  }

  // --- VIEW 3: PRODUCT DETAILS (SINGLE) ---
  if (viewMode === 'product' && selectedProduct) {
    return (
      <ProductPage
        onBack={() => {
          setViewMode('shop');
          window.history.pushState({ view: 'shop', product: null }, '', '#shop');
        }}
      />
    );
  }

  // --- VIEW 2: ADMIN DASHBOARD (MANAGEMENT) - NEW LAYOUT ---
  return (
    <AdminLayout activePage={adminPage} onNavigate={setAdminPage}>
      {adminPage === 'dashboard' && <DashboardPage />}
      {adminPage === 'orders' && <OrdersPage />}
      {adminPage === 'products/new' && <AddProductPage />}
      {adminPage === 'settings' && <SettingsPage />}

      {/* Preview Button (Temporary location for manual switching) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setViewMode('shop');
            window.history.pushState({ view: 'shop', product: null }, '', '#shop');
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-xl font-bold text-sm hover:bg-indigo-700 transition"
        >
          Preview Store
        </button>
      </div>
    </AdminLayout>
  );
}

export default App;