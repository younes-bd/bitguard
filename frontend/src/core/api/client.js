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

// Interceptor: Attach JWT Token and Tenant ID to every request
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            if (config.headers.set) {
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        // Dynamic Tenant Resolution (Fallback to bitguard.tech for now)
        const tenantId = localStorage.getItem('tenant_id') || 'bitguard.tech';
        if (config.headers.set) {
            config.headers.set('X-Tenant-ID', tenantId);
        } else {
            config.headers['X-Tenant-ID'] = tenantId;
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
                    const res = await axios.post(`${baseURL}auth/jwt/refresh/`, {
                        refresh: refreshToken
                    });

                    if (res.status === 200) {
                        const newAccessToken = res.data.access || res.data.data?.access;
                        localStorage.setItem('access_token', newAccessToken);
                        
                        // Axios 1.x requires .set() for AxiosHeaders instances
                        if (client.defaults.headers.common.set) {
                            client.defaults.headers.common.set('Authorization', `Bearer ${newAccessToken}`);
                        } else {
                            client.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                        }

                        if (originalRequest.headers.set) {
                            originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
                        } else {
                            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        }
                        
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
