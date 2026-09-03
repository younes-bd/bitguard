import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * @returns {{
 *   user: object|null,
 *   isAuthenticated: boolean,
 *   isAdmin: boolean,
 *   loading: boolean,
 *   hasPermission: (perm: string) => boolean,
 *   login: (email: string, password: string) => Promise<any>,
 *   logout: () => void,
 *   verifyOtp: (tempUserId: string, token: string) => Promise<any>,
 *   register: (data: object) => Promise<any>,
 *   refreshUser: () => Promise<void>,
 *   updateUser: (data: object) => void,
 * }}
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
