import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/system/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { NotificationsProvider } from './hooks/useNotifications';

export default function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <NotificationsProvider>
            <div className="flex min-h-screen bg-slate-100">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="w-full min-w-0 ml-0 p-6 md:ml-64 mt-14 md:mt-0">
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </main>
                <Toaster position="top-right" />
            </div>
        </NotificationsProvider>
    );
}
