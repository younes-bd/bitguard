import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import PublicLayout from './layouts/PublicLayout';
import AccountsLayout from './layouts/AccountsLayout';
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
import Login from '../apps/auth/pages/Login';
import Register from '../apps/auth/pages/Register';
import ForgotPassword from '../apps/auth/pages/ForgotPassword';
import { WebsiteRoutes } from '../apps/website/routes/WebsiteRoutes';
import { BlogRoutes } from '../apps/blog/routes/BlogRoutes';

// Feature Pages - Store
import ProductCatalog from '../apps/store/pages/ProductCatalog';
import ProductDetail from '../apps/store/pages/ProductDetail';

// Accounts Pages
import AccountHome from '../apps/users/pages/AccountHome';
import PersonalInfo from '../apps/users/pages/PersonalInfo';
import EditName from '../apps/users/pages/edit/EditName';
import EditPhone from '../apps/users/pages/edit/EditPhone';
import EditBirthday from '../apps/users/pages/edit/EditBirthday';
import EditGender from '../apps/users/pages/edit/EditGender';
import EditPhoto from '../apps/users/pages/edit/EditPhoto';
import EditLanguage from '../apps/users/pages/edit/EditLanguage';
import EditCurrency from '../apps/users/pages/edit/EditCurrency';
import EditAddress from '../apps/users/pages/edit/EditAddress';
import ChangePassword from '../apps/users/pages/edit/ChangePassword';
import ActivityLog from '../apps/users/pages/ActivityLog';
import People from '../apps/users/pages/People';
import Security from '../apps/users/pages/Security';
import DataPrivacy from '../apps/users/pages/DataPrivacy';
import Payments from '../apps/users/pages/Payments';

// Core Routing
import { EnterpriseRouter } from '../apps/dashboard/routes/EnterpriseRouter';
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
            {/* Public Routes with Layout */}
            {/* Public Modular Feature Routes */}
            <Route path="/*" element={<WebsiteRoutes />} />
            <Route path="/blog/*" element={<BlogRoutes />} />

            {/* Public Store Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/store" element={<ProductCatalog />} />
                <Route path="/store/:slug" element={<ProductDetail />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Accounts Routes - Separate Layout (Kept as is) */}
            <Route element={<ProtectedRoute><AccountsLayout /></ProtectedRoute>}>
                <Route path="account/home" element={<AccountHome />} />
                <Route path="account/personal-info" element={<PersonalInfo />} />
                {/* Edit Routes */}
                <Route path="account/personal-info/name" element={<EditName />} />
                <Route path="account/personal-info/phone" element={<EditPhone />} />
                <Route path="account/personal-info/birthday" element={<EditBirthday />} />
                <Route path="account/personal-info/gender" element={<EditGender />} />
                <Route path="account/personal-info/photo" element={<EditPhoto />} />
                <Route path="account/personal-info/language" element={<EditLanguage />} />
                <Route path="account/personal-info/currency" element={<EditCurrency />} />
                <Route path="account/personal-info/address" element={<EditAddress />} />
                <Route path="account/people" element={<People />} />

                {/* Security Sub-pages */}
                <Route path="account/security/password" element={<ChangePassword />} />
                <Route path="account/security/activity" element={<ActivityLog />} />

                <Route path="account/security" element={<Security />} />
                <Route path="account/data-privacy" element={<DataPrivacy />} />
                <Route path="account/payments" element={<Payments />} />
                {/* Fallback to home */}
                <Route path="account" element={<Navigate to="account/home" replace />} />
            </Route>

            {/* Core Framework Routing (Role Based) */}
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                {/* 
                    If user is admin (staff), they get the AppRoutes (Management).
                    PortalRoutes (Unified Portal) is always available to test/use.
                 */}
                {isAdmin && EnterpriseRouter}
                {PortalRoutes}
            </Route>

            {/* Redirects for legacy routes */}
            <Route path="/dashboard" element={<Navigate to={isAdmin ? "/admin" : "/portal"} replace />} />
            <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
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
