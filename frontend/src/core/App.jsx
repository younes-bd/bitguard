import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AccountsLayout from './layouts/AccountsLayout';
import ProtectedRoute from './api/auth/ProtectedRoute';

// Public/Auth Pages
import Login from '../apps/auth/pages/Login';
import Register from '../apps/auth/pages/Register';
import ForgotPassword from '../apps/auth/pages/ForgotPassword';
import LandingPage from '../apps/website/pages/LandingPage';
import About from '../apps/website/pages/About';
import Contact from '../apps/website/pages/Contact';
import Support from '../apps/website/pages/Support';
import ServiceDetail from '../apps/website/pages/ServiceDetail';
import Team from '../apps/website/pages/Team';
import Careers from '../apps/website/pages/Careers';
import Brochure from '../apps/website/pages/Brochure';
import Events from '../apps/website/pages/Events';
import FreeTools from '../apps/website/pages/FreeTools';
import Podcasts from '../apps/website/pages/Podcasts';
import Reports from '../apps/website/pages/Reports';
import Compliance from '../apps/website/pages/Compliance';
import BlogList from '../apps/website/pages/BlogList';
import BlogPost from '../apps/website/pages/BlogPost';

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
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogPost />} />

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
