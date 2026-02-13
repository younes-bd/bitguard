import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AccountsLayout from '../layouts/AccountsLayout';
import ProtectedRoute from '../shared/core/auth/ProtectedRoute';

// Public/Auth Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import LandingPage from '../pages/home/LandingPage';
import About from '../pages/home/About';
import Contact from '../pages/home/Contact';
import Support from '../pages/home/Support';
import ServiceDetail from '../pages/home/ServiceDetail';
import Team from '../pages/home/Team';
import Careers from '../pages/home/Careers';
import Brochure from '../pages/home/Brochure';
import Events from '../pages/home/Events';
import FreeTools from '../pages/home/FreeTools';
import Podcasts from '../pages/home/Podcasts';
import Reports from '../pages/home/Reports';
import Compliance from '../pages/home/Compliance';

// Feature Pages - Store
import ProductCatalog from '../features/store/pages/ProductCatalog';
import ProductDetail from '../features/store/pages/ProductDetail';

// Accounts Pages
import AccountHome from '../pages/accounts/AccountHome';
import PersonalInfo from '../pages/accounts/PersonalInfo';
import EditName from '../pages/accounts/edit/EditName';
import EditPhone from '../pages/accounts/edit/EditPhone';
import EditBirthday from '../pages/accounts/edit/EditBirthday';
import EditGender from '../pages/accounts/edit/EditGender';
import EditPhoto from '../pages/accounts/edit/EditPhoto';
import EditLanguage from '../pages/accounts/edit/EditLanguage';
import EditCurrency from '../pages/accounts/edit/EditCurrency';
import EditAddress from '../pages/accounts/edit/EditAddress';
import ChangePassword from '../pages/accounts/edit/ChangePassword';
import ActivityLog from '../pages/accounts/ActivityLog';
import People from '../pages/accounts/People';
import Security from '../pages/accounts/Security';
import DataPrivacy from '../pages/accounts/DataPrivacy';
import Payments from '../pages/accounts/Payments';

// Core Routing
import { EnterpriseRouter } from './routes/EnterpriseRouter';
import { useAuth } from '../shared/core/hooks/useAuth';
import { PortalRoutes } from './routes/PortalRoutes';

import { AuthProvider } from '../shared/core/contexts/AuthContext';
import { TenantProvider } from '../shared/core/contexts/TenantContext';
import { NotificationProvider } from '../shared/core/contexts/NotificationContext';

const AppContent = () => {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-950 text-blue-500">Loading...</div>;
    }

    return (
        <Routes>
            {/* Public Routes with Layout */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/platform/:slug" element={<ServiceDetail />} />
                <Route path="/solutions/:slug" element={<ServiceDetail />} />
                <Route path="/team" element={<Team />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/events" element={<Events />} />
                <Route path="/free-tools" element={<FreeTools />} />
                <Route path="/podcasts" element={<Podcasts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/compliance" element={<Compliance />} />

                {/* Public Store Routes */}
                <Route path="/store" element={<ProductCatalog />} />
                <Route path="/store/:slug" element={<ProductDetail />} />
            </Route >

            <Route path="/brochure/:slug" element={<Brochure />} />
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
                    If user is not admin (Tenant/Shopper), they get PortalRoutes (Unified Portal).
                    
                    PortalRoutes contains Store, CRM, ERP, etc.
                 */}
                {isAdmin ? EnterpriseRouter : PortalRoutes}
            </Route>

            {/* Redirects for legacy routes */}
            <Route path="/dashboard" element={<Navigate to={isAdmin ? "/admin" : "/store"} replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes >
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <TenantProvider>
                    <NotificationProvider>
                        <AppContent />
                    </NotificationProvider >
                </TenantProvider >
            </AuthProvider>
        </Router >
    );
};

export default App;
