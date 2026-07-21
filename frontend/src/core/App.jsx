import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import WebsiteLayout from './layouts/WebsiteLayout';
import ProtectedRoute from './api/auth/ProtectedRoute';

// Override global alert to utilize enterprise toast notifications
const originalAlert = window.alert;
window.alert = (message) => {
    toast(message, {
        icon: '🔔',
        style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
        },
    });
};

// Public/Auth Pages
import Login from '../apps/auth/pages/public/Login';
import Register from '../apps/auth/pages/public/Register';
import ForgotPassword from '../apps/auth/pages/public/ForgotPassword';
import { WebsiteRoutes } from '../apps/website/routes/WebsiteRoutes';
import { BlogRoutes } from '../apps/blog/routes/BlogRoutes';

// Feature Pages - Store
import ProductCatalog from '../apps/ecommerce/pages/public/ProductCatalog';
import ProductDetail from '../apps/ecommerce/pages/public/ProductDetail';
import Checkout from '../apps/ecommerce/pages/public/Checkout';

// Core Routing
import { EnterpriseRoutes } from '../apps/board/routes/EnterpriseRouter';
import { useAuth } from './hooks/useAuth';
import { PortalRoutes } from './routes/PortalRoutes';

import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import { NotificationProvider } from './context/NotificationContext';

const AppContent = () => {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-950 text-blue-500">Loading...</div>;
    }

    return (
        <Routes>
            {/* Specific routes FIRST — before the wildcard */}
            <Route path="/blog/*" element={<BlogRoutes />} />

            {/* Public Store Routes */}
            <Route element={<WebsiteLayout />}>
                <Route path="/store" element={<ProductCatalog />} />
                <Route path="/store/checkout" element={<Checkout />} />
                <Route path="/store/:slug" element={<ProductDetail />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Core Framework Routing (Role Based) */}
            <Route path="/admin/*" element={
                <ProtectedRoute>
                    {isAdmin ? <EnterpriseRoutes /> : <Navigate to="/portal" replace />}
                </ProtectedRoute>
            } />

            <Route path="/portal/*" element={
                <ProtectedRoute>
                    <PortalRoutes />
                </ProtectedRoute>
            } />

            {/* Redirects */}
            <Route path="/dashboard" element={<Navigate to={isAdmin ? "/admin" : "/portal"} replace />} />
            {/* Role-aware settings redirect (H-11 fix) */}
            <Route path="/settings" element={<Navigate to={isAdmin ? "/admin/settings" : "/portal/security"} replace />} />

            {/* Public Marketing Routes — wildcard LAST so all specific routes above match first */}
            <Route path="/*" element={<WebsiteRoutes />} />
        </Routes >
    );
};

const App = () => {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <TenantProvider>
                    <NotificationProvider>
                        <Toaster position="top-right" reverseOrder={false} />
                        <AppContent />
                    </NotificationProvider >
                </TenantProvider >
            </AuthProvider>
        </Router >
    );
};

export default App;
