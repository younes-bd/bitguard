import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import { storeService } from '../api/storeService';
import client from '../api/client';

// Dictionary export for useContext(AuthContext)
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const userData = await authService.getCurrentUser();

            // 1. Trust Django's built-in flags first (most reliable)
            const hasAdminFlag = userData.is_staff === true || userData.is_superuser === true;

            // 2. Fallback: check roles array for common admin role names (case-insensitive)
            const adminRoleNames = ['super_admin', 'tenant_admin', 'admin', 'superadmin'];
            const hasAdminRole = userData.roles?.some(
                r => adminRoleNames.includes(r.name?.toLowerCase())
            ) || false;

            setIsAdmin(hasAdminFlag || hasAdminRole);

            setUser(userData);
            return userData;
        } catch (error) {
            console.error("Failed to fetch user", error);
            if (error.response?.status === 401) {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('access_token');
            }
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setIsAuthenticated(true);
                // Fetch full profile to get role
                await fetchUser();
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        const data = await authService.login({ email, password });

        if (data.access) {
            // Direct success
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            client.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

            setIsAuthenticated(true);
            await fetchUser(); // Fetch roles immediately
        }
        return data;
    };

    const verifyOtp = async (userId, code) => {
        const data = await authService.verifyOtp({ user_id: userId, code });
        if (data.access) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            client.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
            setIsAuthenticated(true);
            await fetchUser();
        }
        return data;
    };

    const register = async (userData) => {
        return authService.register(userData);
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        delete client.defaults.headers.common['Authorization'];
    };

    const buyProduct = async (productId) => {
        // For simplified demo, we treat 'buy' like start trial but active
        // In real app, this goes to Stripe checkout URL
        console.log(`Redirecting to checkout for: ${productId}`);
        // For now, we reuse the trial endpoint for demo or just return true
        return { success: true };
    };

    const startTrial = async (planId) => {
        try {
            await storeService.startTrial(planId);
            await fetchUser(); // Refresh user data to get new subscription
            return { success: true };
        } catch (error) {
            console.error("Trial start failed", error);
            return { success: false, error };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isAdmin,
            loading,
            login,
            verifyOtp,
            register,
            logout,
            buyProduct,
            startTrial
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
