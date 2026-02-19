import { useState } from "react";
import { Menu, X, LayoutDashboard, Package, ShoppingBag, Settings, ExternalLink } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Sidebar({
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
}: any) {
    const { store } = useStore();
    const storeName = store?.store_name || "BrewCart Pro";

    const navItem = (key: string, label: string, Icon: any) => (
        <button
            onClick={() => {
                setActiveTab(key);
                setSidebarOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3
        ${activeTab === key ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <>
            {/* MOBILE HEADER */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900 flex items-center px-4 z-40 shadow-md justify-between">
                <div className="flex items-center">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
                        <Menu className="text-white" />
                    </button>
                    <span className="text-white ml-2 font-bold truncate max-w-[200px]">{storeName}</span>
                </div>
            </div>

            {/* OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 md:hidden animate-in fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <div
                className={`
          fixed top-0 bottom-0 w-64 bg-slate-900 text-white flex flex-col z-[60] shadow-xl
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "left-0" : "-left-64"}
          md:left-0
        `}
            >
                <div className="p-6 flex items-center justify-between border-b border-slate-800 mb-2">
                    <span className="font-bold text-lg tracking-tight truncate">{storeName}</span>
                    <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="text-slate-400 hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 px-3 space-y-1 overflow-y-auto py-4">
                    {navItem("dashboard", "Overview", LayoutDashboard)}
                    {navItem("products", "Products", Package)}
                    {navItem("orders", "Orders", ShoppingBag)}
                    {navItem("settings", "Settings", Settings)}
                </div>

                {/* VIEW STORE BUTTON */}
                {store?.domain && (
                    <div className="mt-auto px-4 py-4 border-t border-slate-800">
                        <a
                            href="https://heaven-brew-store.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-all hover:text-white hover:bg-slate-800"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Store</span>
                        </a>
                    </div>
                )}

                <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
                    &copy; {new Date().getFullYear()} BrewCart Engine
                </div>
            </div>
        </>
    );
}
