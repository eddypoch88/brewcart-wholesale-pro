import { Menu, X, LayoutDashboard, Package, ShoppingBag, Settings, ExternalLink, TrendingUp, LogOut, Sun, Moon, Megaphone, CreditCard, ShieldCheck, Store } from "lucide-react";
import { useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useStore as useStoreData } from "../hooks/useStore";
import NotificationBell from "./NotificationBell";
import { useNotifications } from "../hooks/useNotifications";
import { useTheme } from "../hooks/useTheme";
import { usePWA } from "../hooks/usePWA";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}) {
    const { settings } = useStore();
    const { store } = useStoreData(); // for slug
    const { addNotification } = useNotifications();
    const { theme, toggleTheme } = useTheme();
    const { isReady: isPWAReady, installApp } = usePWA();
    const { isSuperAdmin } = useAuth();
    const navigate = useNavigate();
    const storeName = settings.store_name || "ORB Commerce";
    const storeUrl = store?.slug ? `/store/${store.slug}` : '/';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const closeSidebarOnMobile = useCallback(() => {
        if (window.innerWidth < 768) {
            setTimeout(() => setSidebarOpen(false), 150);
        }
    }, [setSidebarOpen]);

    const navItem = (to: string, label: string, Icon: any) => (
        <NavLink
            to={to}
            onClick={closeSidebarOnMobile}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-transparent border-l-2 border-blue-500 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon
                        size={20}
                        className={`transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-blue-400" : ""}`}
                    />
                    <span className="text-sm font-medium">{label}</span>
                </>
            )}
        </NavLink>
    );

    return (
        <>
            {/* MOBILE HEADER */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900 flex items-center px-4 z-40 shadow-md justify-between">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                {settings.logo_url ? (
                    <img src={settings.logo_url} alt={storeName} className="h-8 object-contain" />
                ) : (
                    <span className="text-white font-bold text-lg">{storeName}</span>
                )}
            </div>

            {/* OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-[60] transition-transform duration-300 md:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Store Header */}
                <div className="px-5 pt-6 pb-5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        {settings.logo_url ? (
                            <img src={settings.logo_url} alt={storeName} className="h-9 object-contain" />
                        ) : (
                            <h1 className="text-lg font-bold text-white truncate">{storeName}</h1>
                        )}
                        {/* Live indicator */}
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                            <span className="text-xs text-green-400 font-medium">Live</span>
                        </div>
                    </div>
                    <button className="md:hidden ml-2 text-slate-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">

                    <NotificationBell />



                    {navItem("dashboard", "Overview", LayoutDashboard)}
                    {navItem("analytics", "Analytics", TrendingUp)}
                    {navItem("products", "Products", Package)}
                    {navItem("orders", "Orders", ShoppingBag)}
                    {navItem("payment", "Payment", CreditCard)}
                    {navItem("marketing", "Marketing", Megaphone)}
                    {navItem("settings", "Settings", Settings)}

                    {isSuperAdmin && (
                        <div className="pt-4 mt-4 border-t border-slate-800">
                            <span className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Platform Master</span>
                            {navItem("super", "Super Admin", ShieldCheck)}
                        </div>
                    )}

                </nav>

                {/* Bottom Actions Section */}
                <div className="px-3 py-3 border-t border-slate-800">
                    <div className="space-y-1 mb-2">
                        {/* View My Store — opens in new tab */}
                        <a
                            href={storeUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={closeSidebarOnMobile}
                            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 group"
                        >
                            <ExternalLink size={20} className="transition-transform duration-200 group-hover:scale-105" />
                            <span className="text-sm font-medium">View My Store</span>
                            <span className="ml-auto text-[10px] bg-blue-600/30 text-blue-400 px-1.5 py-0.5 rounded-full font-medium">Live ↗</span>
                        </a>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-medium">Sign Out</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-4 pt-4 pb-2 border-t border-slate-800">
                        <div className="text-slate-400 text-sm font-medium">
                            Dark Mode
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${theme === 'dark' ? 'bg-blue-500' : 'bg-slate-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
                    © {new Date().getFullYear()} ORB Commerce
                </div>
            </aside>
        </>
    );
}
