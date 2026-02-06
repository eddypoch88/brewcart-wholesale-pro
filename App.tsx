import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';
import AddItemModal from './components/AddItemModal';
import Storefront from './components/Storefront';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import OrderList from './components/OrderList';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

const INITIAL_ITEMS = [
  { id: 1, name: 'Heineken Lager', price: 'RM 145.00', stock: 500, status: 'In Stock', image: 'https://images.unsplash.com/photo-1618183179269-e7087679312c?auto=format&fit=crop&q=80&w=500&h=500', description: 'Premium lager beer, 24 cans per carton.' },
  { id: 2, name: 'Guinness Draught', price: 'RM 180.00', stock: 1200, status: 'In Stock', image: 'https://images.unsplash.com/photo-1572569766952-32a2468305c4?auto=format&fit=crop&q=80&w=500&h=500', description: 'Smooth and creamy stout, 24 cans.' },
  { id: 3, name: 'Asahi Super Dry', price: 'RM 155.00', stock: 800, status: 'In Stock', image: 'https://images.unsplash.com/photo-1629247656247-c0e816a76e03?auto=format&fit=crop&q=80&w=500&h=500', description: 'Japanese dry lager, crisp finish.' },
  { id: 4, name: 'Tiger Crystal', price: 'RM 135.00', stock: 600, status: 'In Stock', image: 'https://images.unsplash.com/photo-1606757398157-b4d4520ce48f?auto=format&fit=crop&q=80&w=500&h=500', description: 'Crystal cold filtered lager.' },
  { id: 5, name: 'Corona Extra', price: 'RM 190.00', stock: 45, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1599859567676-13d87532ac6f?auto=format&fit=crop&q=80&w=500&h=500', description: 'Mexican lager, best served with lime.' },
];

function App() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'admin' | 'shop'>('admin');
  const [activeTab, setActiveTab] = useState('home');

  const handleAddItem = (newItem: any) => {
    // Ensure the new item has the required structure
    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      // Ensure price is formatted if it isn't already
      price: newItem.price.toString().startsWith('RM') ? newItem.price : `RM ${newItem.price}`,
      status: 'In Stock',
    };
    setItems([itemToAdd, ...items]);
    setIsModalOpen(false);
  };

  // --- VIEW 1: CUSTOMER STOREFRONT (SHOP) ---
  if (viewMode === 'shop') {
    return (
      <div className="min-h-screen bg-slate-50 relative font-sans">
        {/* Sync: Pass 'items' as 'products' to match Storefront's expected prop */}
        <Storefront products={items} />

        <button
          onClick={() => setViewMode('admin')}
          className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 z-50 hover:scale-110 transition-transform border-2 border-white/20"
        >
          <ArrowLeft size={20} /> Back to Admin
        </button>
      </div>
    );
  }

  // --- VIEW 2: ADMIN DASHBOARD (MANAGEMENT) ---
  return (
    <div className="flex justify-center bg-gray-200 dark:bg-gray-900 min-h-screen font-sans">
      <div className="w-full max-w-[480px] bg-white dark:bg-gray-950 min-h-screen shadow-2xl relative overflow-hidden flex flex-col border-x border-slate-200 dark:border-slate-800">

        <Header />

        {/* View Mode Switcher */}
        <div className="px-6 pt-4 pb-2">
          <button
            onClick={() => setViewMode('shop')}
            className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition border border-indigo-100 shadow-sm active:scale-95"
          >
            <ShoppingBag size={18} /> Preview Customer Store
          </button>
        </div>

        {/* Main Content Area - Conditional Rendering based on activeTab */}
        <div className="flex-1 overflow-y-auto pb-32 px-0">
          {activeTab === 'home' && <Dashboard items={items} />}
          {activeTab === 'sales' && <AnalyticsView />}
          {activeTab === 'orders' && <OrderList />}
          {activeTab === 'settings' && <SettingsView />}
        </div>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddClick={() => setIsModalOpen(true)}
        />

        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddItem}
        />

      </div>
    </div>
  );
}

export default App;