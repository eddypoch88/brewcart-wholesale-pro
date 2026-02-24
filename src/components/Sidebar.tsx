import { Menu, X, LayoutDashboard, Package, ShoppingBag, Settings, ExternalLink, TrendingUp } from "lucide-react";
import { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import NotificationBell from "./NotificationBell";
import { useNotifications } from "../hooks/useNotifications";

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}) {
    const { settings } = useStore();
    const { addNotification } = useNotifications();
    const storeName = settings.store_name || "BrewCart Pro";

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

                    {/* TEST BUTTON (Temporary) */}
                    <button
                        onClick={() => {
                            addNotification({
                                id: `TEST-${Date.now()}`,
                                customerName: 'Test User',
                                total: 99.99,
                                createdAt: new Date().toISOString(),
                                read: false
                            });
                        }}
                        className="w-full flex justify-center mt-2 px-4 py-2 bg-slate-800 text-slate-400 text-xs rounded-lg hover:text-white"
                    >
                        Test Demo Notification
                    </button>

                    <div className="border-t border-slate-800 my-5" />

                    {navItem("dashboard", "Overview", LayoutDashboard)}
                    {navItem("analytics", "Analytics", TrendingUp)}
                    {navItem("products", "Products", Package)}
                    {navItem("orders", "Orders", ShoppingBag)}
                    {navItem("settings", "Settings", Settings)}

                    <div className="border-t border-slate-800 my-5" />

                    <a
                        href="/"
                        onClick={closeSidebarOnMobile}
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 group border-l-2 border-transparent"
                    >
                        <ExternalLink size={20} className="transition-transform duration-200 group-hover:scale-105" />
                        <span className="text-sm font-medium">View Storefront</span>
                    </a>
                </nav>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-slate-800 text-[11px] text-slate-600 text-center">
                    © {new Date().getFullYear()} BrewCart Engine
                </div>
            </aside>
        </>
    );
}
