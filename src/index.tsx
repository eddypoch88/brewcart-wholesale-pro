import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Toaster } from 'react-hot-toast';
import { registerSW } from 'virtual:pwa-register';

// White Screen Killer: Auto-reload when old chunks fail to load after a deployment
window.addEventListener('error', (e) => {
    if (/Loading chunk [\d]+ failed/.test(e.message) || /dynamically imported module/.test(e.message)) {
        console.warn('Chunk load error detected, reloading page to fetch new version...');
        window.location.reload();
    }
});

// Auto-update Service Worker
const updateSW = registerSW({
    onNeedRefresh() {
        updateSW(true);
    }
});

// Admin
import App from './App';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useStore } from './context/StoreContext';
import { NotificationsProvider } from './hooks/useNotifications';

// Store
import StoreLayout from './pages/store/StoreLayout';
import StorePage from './pages/store/StorePage';
import ProductPage from './pages/store/ProductPage';
import CartPage from './pages/store/CartPage';
import CheckoutPage from './pages/store/CheckoutPage';
import OrderConfirmationPage from './pages/store/OrderConfirmationPage';
import OrderReviewPage from './pages/store/OrderReviewPage';

import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StoreProvider>
            <BrowserRouter>
                <Routes>
                    {/* AUTH */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* FRONT STORE */}
                    <Route element={<StoreLayout />}>
                        <Route path="/" element={<StorePage />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                        <Route path="/order-review/:orderId" element={<OrderReviewPage />} />
                    </Route>

                    {/* ADMIN CMS - PROTECTED */}
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminNotificationsWrapper />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={
                            <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./components/Dashboard')))}
                            </React.Suspense>
                        } />
                        <Route path="analytics" element={
                            <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./components/Analytics')))}
                            </React.Suspense>
                        } />
                        <Route path="products" element={
                            <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./components/admin/AdminProductPage')))}
                            </React.Suspense>
                        } />
                        <Route path="orders" element={
                            <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./components/OrderList')))}
                            </React.Suspense>
                        } />
                        <Route path="settings" element={
                            <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./components/Settings')))}
                            </React.Suspense>
                        } />
                        <Route path="marketing" element={
                            <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./pages/admin/MarketingSettings')))}
                            </React.Suspense>
                        } />
                        <Route path="payment" element={
                            <React.Suspense fallback={<div className="p-8">Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./pages/admin/PaymentSettings')))}
                            </React.Suspense>
                        } />
                    </Route>
                </Routes>
                <Toaster position="top-right" />
            </BrowserRouter>
        </StoreProvider>
    </React.StrictMode>
);

/**
 * AdminNotificationsWrapper — reads storeId from StoreContext and passes it
 * to NotificationsProvider so realtime order subscriptions are scoped to
 * the current authenticated user's store only (multi-tenant isolation).
 */
function AdminNotificationsWrapper() {
    const { storeId } = useStore();
    return (
        <NotificationsProvider storeId={storeId}>
            <App />
        </NotificationsProvider>
    );
}
