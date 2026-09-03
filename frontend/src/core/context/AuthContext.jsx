import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../apps/auth/api/authService';
import client from '../api/client';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Derive isAdmin from the current user object
    const isAdmin = useMemo(() => {
        if (!user) return false;
        const hasAdminFlag = !!user.is_staff || !!user.is_superuser;
        const adminRoleNames = ['super_admin', 'tenant_admin', 'admin', 'superadmin'];
        const hasAdminRole = user.roles?.some(
            r => adminRoleNames.includes(r.name?.toLowerCase())
        ) || false;
        return hasAdminFlag || hasAdminRole;
    }, [user]);

    // Role-based Access Control
    const hasPermission = useCallback((permCode) => {
        if (!user) return false;
        if (user.is_superuser) return true;
        return user.permissions?.includes(permCode) || false;
    }, [user]);

    const fetchUser = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Failed to fetch user:', error);
            throw error;
        }
    };

    const initAuth = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                await fetchUser();
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth initialization failed');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setIsAuthenticated(false);
                setUser(null);
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete client.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate]);

    // Listen for auth:logout event (e.g., from failed token refresh)
    useEffect(() => {
        const handleAuthLogout = () => logout();
        window.addEventListener('auth:logout', handleAuthLogout);
        return () => window.removeEventListener('auth:logout', handleAuthLogout);
    }, [logout]);

    const login = async (email, password) => {
        const data = await authService.login({ email, password });
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            if (data.user) {
                setUser(prev => ({ ...prev, ...data.user }));
            }
            
            await fetchUser();
            setIsAuthenticated(true);
        }
        return data;
    };

    const verifyOtp = async (tempUserId, token) => {
        const data = await authService.verifyOtp({ temp_user_id: tempUserId, token: token });
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            await fetchUser();
            setIsAuthenticated(true);
        }
        return data;
    };

    const register = async (userData) => {
        return authService.register(userData);
    };

    const refreshUser = async () => {
        if (isAuthenticated) {
            await fetchUser();
        }
    };

    const updateUser = (data) => {
        setUser(prev => ({ ...prev, ...data }));
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isAdmin,
            loading,
            hasPermission,
            login,
            logout,
            verifyOtp,
            register,
            refreshUser,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
