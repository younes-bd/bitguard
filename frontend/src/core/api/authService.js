import client from '@/core/api/client';

export const authService = {
    login: async (credentials) => {
        const response = await client.post('auth/login/', credentials);
        return response.data?.data ?? response.data;
    },
    verifyOtp: async (data) => {
        const response = await client.post('auth/otp-verify/', data);
        return response.data?.data ?? response.data;
    },
    register: async (userData) => {
        const response = await client.post('auth/register/', userData);
        return response.data?.data ?? response.data;
    },
    logout: async () => {
        const refresh_token = localStorage.getItem('refresh_token');
        if (refresh_token) {
            try {
                await client.post('auth/logout/', { refresh: refresh_token });
            } catch (err) {
                console.warn('Backend logout failed', err);
            }
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },
    getCurrentUser: async () => {
        const response = await client.get('users/me/');
        return response.data?.data ?? response.data;
    },
    confirmPasswordReset: async (data) => {
        const response = await client.post('auth/password-reset/confirm/', data);
        return response.data?.data ?? response.data;
    }
};
