import React, { useState, useEffect } from 'react';
import { Menu, LogOut } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
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
            <Sidebar
                activePage={activePage}
                onNavigate={(page) => {
                    onNavigate(page);
                    setIsMobileMenuOpen(false);
                }}
                className={isMobileMenuOpen ? "block z-50 shadow-2xl" : "hidden md:block"}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden md:pl-64">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex-1 px-4 md:px-8 flex justify-between items-center">
                        <h1 className="text-lg font-semibold text-slate-800 capitalize">
                            {activePage.replace('/', ' ')}
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
                            title="Log Out"
                        >
                            <span className="hidden sm:inline">Log Out</span>
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
