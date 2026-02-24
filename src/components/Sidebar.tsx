import { Menu, X, LayoutDashboard, Package, ShoppingBag, Settings, ExternalLink, TrendingUp } from "lucide-react";
import { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}) {
    const { settings } = useStore();
    const storeName = settings.store_name || "BrewCart Pro";

    // Close sidebar on mobile after any menu click (deferred so animation isn't swallowed by re-render)
    const closeSidebarOnMobile = useCallback(() => {
        if (window.innerWidth < 768) {
            setTimeout(() => setSidebarOpen(false), 150);
        }
    }, [setSidebarOpen]);

    const navItem = (to: string, label: string, Icon: any) => (
        <NavLink
            to={to}
            onClick={closeSidebarOnMobile}
            className={({ isActive }) => `w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3
        ${isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
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

            {/* SIDEBAR — z-[60] so it sits above the overlay (z-50) and clicks aren't intercepted */}
            <aside
                className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white p-6 z-[60] transition-transform duration-300 md:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Logo / Store Name */}
                <div className="mb-8 pb-6 border-b border-slate-700 flex items-center justify-between">
                    {settings.logo_url ? (
                        <img src={settings.logo_url} alt={storeName} className="h-10 object-contain" />
                    ) : (
                        <h1 className="text-2xl font-bold">{storeName}</h1>
                    )}
                    <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="text-slate-400 hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 px-3 space-y-1 overflow-y-auto py-4">
                    {navItem("dashboard", "Overview", LayoutDashboard)}
                    {navItem("analytics", "Analytics", TrendingUp)}
                    {navItem("products", "Products", Package)}
                    {navItem("orders", "Orders", ShoppingBag)}
                    {navItem("settings", "Settings", Settings)}
                    <a
                        href="/"
                        onClick={closeSidebarOnMobile}
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ExternalLink size={20} />
                        <span className="font-medium">View Storefront</span>
                    </a>

                    <div className="border-t border-slate-800 my-2"></div>
                </div>

                <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
                    &copy; {new Date().getFullYear()} BrewCart Engine
                </div>
            </aside>
        </>
    );
}
