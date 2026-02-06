import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Settings, Menu, LogOut, PlusCircle } from 'lucide-react';
import AdminLogin from './login/page';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: string;
    onNavigate: (page: string) => void;
}

export default function AdminLayout({ children, activePage, onNavigate }: AdminLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Check authentication on mount
        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin === "true") {
            setAuthorized(true);
        }
        setChecking(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        setAuthorized(false);
    };

    const handleLoginSuccess = () => {
        setAuthorized(true);
        // Ideally navigate to dashboard, but currently we just show authorized content
        onNavigate('dashboard');
    };

    // "Pagar" Logic: Loading State
    if (checking) {
        return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white text-xl font-bold">Checking Key... 🔑</div>;
    }

    // "Pagar" Logic: Not Authorized -> Show Login
    if (!authorized) {
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    // Authorized Content (The original layout)
    const NavItem = ({ page, icon: Icon, label }: { page: string, icon: any, label: string }) => (
        <button
            onClick={() => {
                onNavigate(page);
                setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activePage === page
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <Icon size={20} className={activePage === page ? 'text-blue-600' : 'text-slate-400'} />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen
      `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-100">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Admin<span className="text-slate-900">Panel</span>
                        </span>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem page="orders" icon={ShoppingBag} label="Orders" />
                        <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Inventory
                        </div>
                        <NavItem page="products/new" icon={PlusCircle} label="Add Product" />
                        <NavItem page="settings" icon={Settings} label="Settings" />
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-slate-100">
                        <div
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 cursor-pointer group transition-colors"
                            onClick={handleLogout}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                AD
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
                                <p className="text-xs text-slate-500 truncate group-hover:text-red-600 transition-colors">Log Out</p>
                            </div>
                            <LogOut size={16} className="text-slate-400 group-hover:text-red-500" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex-1 px-4 md:px-8">
                        <h1 className="text-lg font-semibold text-slate-800 capitalize">
                            {activePage.replace('/', ' ')}
                        </h1>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
