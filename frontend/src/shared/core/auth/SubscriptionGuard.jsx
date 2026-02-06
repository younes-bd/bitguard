import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * SubscriptionGuard
 * 
 * Protects routes requiring specific product subscriptions.
 * Checks if the user has a valid subscription (active or trial) for the required product.
 * 
 * @param {string} requiredProduct - The product ID to check (e.g., 'soc', 'crm')
 */
const SubscriptionGuard = ({ requiredProduct, children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-10 text-slate-400">Verifying access...</div>;
    }

    // Check if user has the product in their subscriptions
    // Data structure expected: user.subscriptions = [{ productId: 'soc', status: 'active' | 'trial', ... }]
    const subscription = user?.subscriptions?.find(sub => sub.productId === requiredProduct);

    const hasAccess = subscription && (subscription.status === 'active' || subscription.status === 'trial');

    if (!hasAccess) {
        // Redirect to the store anchor for this product
        return <Navigate to={`/store?product=${requiredProduct}`} replace />;
    }

    // If wrapping routes (Outlet) or direct children
    return children ? children : <Outlet />;
};

export default SubscriptionGuard;
