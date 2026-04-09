import client from './client';

export const authService = {
    login: async (credentials) => {
        const response = await client.post('auth/login/', credentials);
        return response.data.data;
    },
    verifyOtp: async (data) => {
        const response = await client.post('auth/login/verify-otp/', data);
        return response.data.data;
    },
    register: async (userData) => {
        const response = await client.post('users/', userData);
        return response.data.data;
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Clear cached headers if necessary (client interceptor handles new requests)
    },
    getCurrentUser: async () => {
        const response = await client.get('users/me/');
        return response.data.data;
    }
};
