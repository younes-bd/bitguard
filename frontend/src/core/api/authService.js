import client from './client';

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
        const response = await client.post('accounts/register/', userData);
        return response.data?.data ?? response.data;
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },
    getCurrentUser: async () => {
        const response = await client.get('iam/me/');
        return response.data?.data ?? response.data;
    }
};
