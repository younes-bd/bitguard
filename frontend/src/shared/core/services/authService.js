import client from './client';

export const authService = {
    login: async (credentials) => {
        const response = await client.post('accounts/login/', credentials);
        return response.data;
    },
    verifyOtp: async (data) => {
        const response = await client.post('accounts/login/verify-otp/', data);
        return response.data;
    },
    register: async (userData) => {
        const response = await client.post('accounts/register/', userData);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Clear cached headers if necessary (client interceptor handles new requests)
    },
    getCurrentUser: async () => {
        const response = await client.get('accounts/users/me/');
        return response.data;
    }
};
