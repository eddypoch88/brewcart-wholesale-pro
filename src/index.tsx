import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Admin
import App from './App';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/system/ProtectedRoute';

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
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* AUTH */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* FRONT STORE */}
                        <Route element={<StoreLayout />}>
                            <Route path="/" element={<StorePage />} />
                            <Route path="/product/:id" element={<ProductPage />} />
                            <Route path="/cart" element={<CartPage />} />
                        </Route>

                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                        <Route path="/order-review/:orderId" element={<OrderReviewPage />} />

                        {/* ADMIN CMS - PROTECTED */}
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <App />
                            </ProtectedRoute>
                        } />
                    </Routes>
                    <Toaster position="top-right" />
                </BrowserRouter>
            </AuthProvider>
        </StoreProvider>
    </React.StrictMode>
);
