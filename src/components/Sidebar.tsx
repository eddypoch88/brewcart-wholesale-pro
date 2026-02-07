"use client";
import React from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Settings2,
    ExternalLink,
    Zap
} from 'lucide-react';
import { cn } from "../lib/utils";

// Helper to map links to page keys used in App.tsx
// '/admin' -> 'dashboard'
// '/admin/orders' -> 'orders'
// '/admin/products' -> 'products/new' (Currently mapping to Add Product page as it's the only one existing)
// '/admin/settings' -> 'settings'
const getPageKey = (href: string) => {
    if (href === '/admin') return 'dashboard';
    if (href === '/admin/orders') return 'orders';
    if (href === '/admin/products') return 'products/new';
    if (href === '/admin/settings') return 'settings';
    return '';
};

const menuItems = [
    {
        name: 'Overview',
        href: '/admin',
        icon: LayoutDashboard,
        description: 'Platform statistics'
    },
    {
        name: 'Store Orders',
        href: '/admin/orders',
        icon: ShoppingBag,
        description: 'Manage sales'
    },
    {
        name: 'Manage Products',
        href: '/admin/products',
        icon: Package,
        description: 'Inventory control'
    },
    {
        name: 'Store Configuration',
        href: '/admin/settings',
        icon: Settings2,
        description: 'SaaS & Theme settings'
    },
];

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    className?: string;
}

export default function Sidebar({ activePage, onNavigate, className }: SidebarProps) {

    return (
        <aside className={cn("fixed left-0 top-0 h-screen w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 hidden md:block", className)}>
            {/* Brand Identity - FASA 1 */}
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="bg-blue-600 p-2 rounded-xl">
                    <Zap className="text-white w-5 h-5 fill-current" />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg leading-none">Orb Empire</h1>
                    <span className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">SaaS Platform</span>
                </div>
            </div>

            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const pageKey = getPageKey(item.href);
                    const isActive = activePage === pageKey;

                    return (
                        <button
                            key={item.name}
                            onClick={() => onNavigate(pageKey)}
                            className={cn(
                                "w-full text-left group flex flex-col px-3 py-3 rounded-2xl transition-all duration-200",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                    : "hover:bg-slate-800 hover:text-white border border-transparent"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white")} />
                                <span className="font-semibold text-sm">{item.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1 ml-8 group-hover:text-slate-400">
                                {item.description}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer Sidebar - Shortcut to Live Storefront (FASA 5 teaser) */}
            <div className="absolute bottom-8 left-4 right-4">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all group"
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500">Your Storefront</span>
                        <span className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">View Live</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                </a>
            </div>
        </aside>
    );
}
