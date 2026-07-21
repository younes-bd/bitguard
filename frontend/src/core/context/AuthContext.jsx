import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import { ecommerceService } from '../api/ecommerceService';
import client from '../api/client';

// Dictionary export for useContext(AuthContext)
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Derive isAdmin from the current user object
    const isAdmin = React.useMemo(() => {
        if (!user) return false;
        
        // 1. Check direct flags (handle both true/1 and strings if any)
        const hasAdminFlag = !!user.is_staff || !!user.is_superuser;
        
        // 2. Check roles array for common admin names
        const adminRoleNames = ['super_admin', 'tenant_admin', 'admin', 'superadmin'];
        const hasAdminRole = user.roles?.some(
            r => adminRoleNames.includes(r.name?.toLowerCase())
        ) || false;

        return hasAdminFlag || hasAdminRole;
    }, [user]);

    const fetchUser = async () => {
        try {
            const userData = await authService.getCurrentUser();
            console.log(`[Auth] User fetched: ${userData.email}. Staff: ${userData.is_staff}, Super: ${userData.is_superuser}`);
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Failed to fetch user:', error);
            if (error.response?.status === 401) {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('access_token');
            }
            throw error;
        }
    };

    const initAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                await fetchUser();
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth initialization failed');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        initAuth();
    }, []);

    const login = async (email, password) => {
        const data = await authService.login({ email, password });
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            client.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

            // Use the user data from login response immediately if it has enough info,
            // but still call fetchUser to get the full profile/roles.
            if (data.user) {
                setUser(prev => ({ ...prev, ...data.user }));
            }
            
            await fetchUser();
            setIsAuthenticated(true);
            console.log('[Auth] Login successful. User:', email);
        }
        return data;
    };

    const verifyOtp = async (tempUserId, token) => {
        const data = await authService.verifyOtp({ temp_user_id: tempUserId, token: token });
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            client.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

            await fetchUser();
            setIsAuthenticated(true);
        }
        return data;
    };

    const register = async (userData) => {
        return authService.register(userData);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete client.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
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
            await ecommerceService.startTrial(planId);
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
