import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLoader from './AuthLoader';

const ProtectedRoute = ({ requireAdmin = false, children }) => {
    const { isAuthenticated, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return <AuthLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/portal" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
