import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
    storeName?: string; // 🔥 Tambah prop ni
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, storeName }: SidebarProps) {

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 h-full shadow-xl">
            {/* 1. LOGO AREA */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
                    {storeName ? storeName.substring(0, 2).toUpperCase() : 'BC'}
                </div>
                <span className="font-bold text-xl tracking-tight">{storeName || 'BrewCart Admin'}</span>
            </div>

            {/* 2. MENU ITEMS */}
            <div className="flex-1 py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 translate-x-1'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }
              `}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 3. LOGOUT AREA */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    <span>Exit Admin</span>
                </button>
            </div>
        </div>
    );
}
