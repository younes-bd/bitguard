import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import WebsiteLayout from '../apps/website/layouts/WebsiteLayout';
import ProtectedRoute from './guards/ProtectedRoute';
import AuthLoader from './guards/AuthLoader';

// Frontend Applications
import { authAdminRoutes as authRoutes } from '../apps/auth/routes/authAdminRoutes';
import { websitePublicRoutes as WebsiteRoutes } from '../apps/website/routes/websitePublicRoutes';
import { blogPublicRoutes as BlogRoutes } from '../apps/blog/routes/blogPublicRoutes';
import { ecommercePublicRoutes } from '../apps/ecommerce/routes/ecommercePublicRoutes';
import { learningPublicRoutes } from '../apps/learning/routes/learningPublicRoutes';
import { eventsPublicRoutes } from '../apps/events/routes/eventsPublicRoutes';
import { helpdeskPublicRoutes } from '../apps/helpdesk/routes/helpdeskPublicRoutes';
import { appointmentsPublicRoutes } from '../apps/appointments/routes/appointmentsPublicRoutes';
import { recruitmentPublicRoutes } from '../apps/recruiting/routes/recruitmentPublicRoutes';

// Core Routing
import { BackendRoutes } from './routes/BackendRoutes';
import { portalRoutes as PortalRoutes } from '../apps/portal/routes/portalRoutes';
import { useAuth } from './hooks/useAuth';

import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import { InboxProvider } from './context/InboxContext';
import { ThemeProvider } from './context/ThemeProvider';
import { ConfigProvider } from './context/ConfigContext';
import { DeveloperModeProvider } from './context/DeveloperModeContext';

const AppContent = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    // Global loading guard
    if (loading) {
        return <AuthLoader />;
    }

    // Handle after-login redirect gracefully inside AppContent
    if (isAuthenticated && location.pathname === '/login') {
        const from = location.state?.from?.pathname || (isAdmin ? '/admin' : '/portal');
        return <Navigate to={from} replace />;
    }

    return (
        <Routes>
            {/* Frontend / Public Website */}
            <Route path="/*" element={<WebsiteRoutes />} />
            <Route path="/blog/*" element={<BlogRoutes />} />
            {ecommercePublicRoutes}
            <Route path="/courses/*" element={learningPublicRoutes} />
            <Route path="/events/*" element={eventsPublicRoutes} />
            <Route path="/helpdesk/*" element={helpdeskPublicRoutes} />
            <Route path="/appointments/*" element={appointmentsPublicRoutes} />
            <Route path="/jobs/*" element={recruitmentPublicRoutes} />

            {/* Auth Routes */}
            {authRoutes}

            {/* Core Framework Routing (Role Based) */}
            <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin={true}>
                    <BackendRoutes />
                </ProtectedRoute>
            } />

            <Route path="/portal/*" element={
                <ProtectedRoute requireAdmin={false}>
                    <PortalRoutes />
                </ProtectedRoute>
            } />

            {/* Redirects */}
            <Route path="/dashboard" element={<Navigate to={isAdmin ? "/admin" : "/portal"} replace />} />
            <Route path="/settings" element={<Navigate to={isAdmin ? "/admin/settings" : "/portal/account"} replace />} />

            {/* Public Journeys Routes — wildcard LAST so all specific routes above match first */}
            <Route path="/*" element={<WebsiteRoutes />} />
        </Routes>
    );
};

const App = () => {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <TenantProvider>
                    <ConfigProvider>
                        <InboxProvider>
                            <DeveloperModeProvider>
                                <ThemeProvider>
                                <Toaster position="top-right" reverseOrder={false} />
                                <AppContent />
                            </ThemeProvider>
                            </DeveloperModeProvider>
                        </InboxProvider>
                    </ConfigProvider>
                </TenantProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;


