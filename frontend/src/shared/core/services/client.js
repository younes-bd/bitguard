import axios from 'axios';

// Base API URL - pointing to our Django backend
const baseURL = 'http://127.0.0.1:8000/api/';

const client = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: false,
});

// Interceptor: Attach JWT Token to every request
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor: Handle Token Expiration
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 (Unauthorized) and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const res = await axios.post(`${baseURL}accounts/token/refresh/`, {
                        refresh: refreshToken
                    });

                    if (res.status === 200) {
                        localStorage.setItem('access_token', res.data.access);
                        client.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                        return client(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Logout if refresh fails
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;
