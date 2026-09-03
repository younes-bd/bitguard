import axios from 'axios';

// Base API URL - environment-based
export const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1/';

const client = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: false,
});

/**
 * Helper to normalize setting headers for Axios 1.x
 */
const setHeader = (configOrHeaders, name, value) => {
    if (configOrHeaders.headers && configOrHeaders.headers.set) {
        configOrHeaders.headers.set(name, value);
    } else if (configOrHeaders.set) {
        configOrHeaders.set(name, value);
    } else if (configOrHeaders.headers) {
        configOrHeaders.headers[name] = value;
    } else {
        configOrHeaders[name] = value;
    }
};

/**
 * Data extraction helper to handle DRF enveloped responses
 */
export const extractData = (response) => {
    return response.data?.data ?? response.data;
};

// ─── Token Refresh Mutex Logic ────────────────────────────────────────────────
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};
// ──────────────────────────────────────────────────────────────────────────────

// Interceptor: Attach JWT Token and Tenant ID to every request
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setHeader(config, 'Authorization', `Bearer ${token}`);
        }

        // Dynamic Tenant Resolution
        // Defaulting to 'localhost' prevents the backend middleware from falling back
        // to IP-based subdomain parsing which incorrectly parses '127.0.0.1' as tenant '127'
        const tenantId = localStorage.getItem('erp_tenant_id') || 'localhost';
        setHeader(config, 'X-Tenant-ID', tenantId);

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

        // Handle 401 Unauthorized (Token Expiration)
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, wait for it to finish and retry
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        setHeader(originalRequest, 'Authorization', `Bearer ${token}`);
                        resolve(client(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const res = await axios.post(`${baseURL}auth/jwt/refresh/`, {
                        refresh: refreshToken
                    });

                    if (res.status === 200) {
                        const newAccessToken = res.data.data?.access_token || res.data.access_token;
                        localStorage.setItem('access_token', newAccessToken);

                        setHeader(client.defaults, 'Authorization', `Bearer ${newAccessToken}`);
                        
                        isRefreshing = false;
                        onRefreshed(newAccessToken);

                        setHeader(originalRequest, 'Authorization', `Bearer ${newAccessToken}`);
                        return client(originalRequest);
                    }
                }
            } catch (refreshError) {
                isRefreshing = false;
                // Dispatch logout event instead of forcing window reload
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Access Denied: You do not have permission to perform this action.');
            window.dispatchEvent(new CustomEvent('api:error:403', { detail: error.response?.data?.message || 'Access Denied' }));
        }

        // Handle 500 Internal Server Error
        if (error.response?.status >= 500) {
            console.error('Server Error: Something went wrong on our end.');
            window.dispatchEvent(new CustomEvent('api:error:500', { detail: error.response?.data?.message || 'Internal Server Error' }));
        }

        return Promise.reject(error);
    }
);

export default client;
