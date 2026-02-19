import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import AdminProductPage from './components/admin/AdminProductPage';
import OrderList from './components/OrderList';
import Settings from './components/Settings';
import ErrorBoundary from './components/system/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderTab = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'analytics': return <Analytics />;
            case 'products': return <AdminProductPage />;
            case 'orders': return <OrderList />;
            case 'settings': return <Settings />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="w-full min-w-0 ml-0 p-6 md:ml-64 mt-14 md:mt-0">
                <ErrorBoundary>
                    {renderTab()}
                </ErrorBoundary>
            </main>
            <Toaster position="top-right" />
        </div>
    );
}
