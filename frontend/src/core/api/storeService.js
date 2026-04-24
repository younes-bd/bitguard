import client from './client';

export const storeService = {
    // --- Products ---
    getProducts: async (params = {}) => {
        const response = await client.get('store/products/', { params });
        return response.data.data;
    },
    getProduct: async (id) => {
        const response = await client.get(`store/products/${id}/`);
        return response.data.data;
    },
    getProductById: async (id) => {
        const response = await client.get(`store/products/${id}/`);
        return response.data.data;
    },

    // --- Categories ---
    getCategories: async () => {
        const response = await client.get('store/categories/');
        return response.data.data;
    },
    createCategory: async (data) => {
        const response = await client.post('store/categories/', data);
        return response.data.data;
    },

    // --- Subscription Plans ---
    getPlans: async () => {
        const response = await client.get('store/subscription-plans/');
        return response.data.data;
    },

    // --- Orders & Checkout ---
    checkout: async (productId, checkoutData) => {
        const response = await client.post(`store/products/${productId}/checkout/`, checkoutData);
        return response.data.data;
    },
    subscribe: async (planId, subscribeData) => {
        const response = await client.post(`store/subscription-plans/${planId}/subscribe/`, subscribeData);
        return response.data.data;
    },
    getOrders: async () => {
        const response = await client.get('store/orders/');
        return response.data.data;
    },
    deleteOrder: async (id) => {
        const response = await client.delete(`store/orders/${id}/`);
        return response.data.data;
    },
    updateOrderStatus: async (id, status) => {
        const response = await client.post(`store/orders/${id}/update_status/`, { status });
        return response.data;
    },

    // --- User Subscriptions & Licenses ---
    getSubscriptions: async () => {
        const response = await client.get('store/subscriptions/');
        return response.data.data;
    },
    startTrial: async (planId) => {
        const response = await client.post('store/subscriptions/start_trial/', { plan_id: planId });
        return response.data.data;
    },
    createSubscription: async (data) => {
        const response = await client.post('store/subscriptions/', data);
        return response.data.data;
    },
    updateSubscription: async (id, data) => {
        const response = await client.put(`store/subscriptions/${id}/`, data);
        return response.data.data;
    },
    cancelSubscription: async (id) => {
        const response = await client.post(`store/subscriptions/${id}/cancel/`);
        return response.data.data;
    },

    getLicenses: async () => {
        const response = await client.get('store/licenses/');
        return response.data.data;
    },

    // --- Customers ---
    getCustomers: async () => {
        const response = await client.get('store/customers/');
        return response.data.data;
    },

    // --- Admin Management (Write Operations) ---
    createProduct: async (data) => {
        const response = await client.post('store/products/', data);
        return response.data.data;
    },
    updateProduct: async (id, data) => {
        const response = await client.put(`store/products/${id}/`, data);
        return response.data.data;
    },
    deleteProduct: async (id) => {
        const response = await client.delete(`store/products/${id}/`);
        return response.data.data;
    },

    // --- Service Catalog ---
    getServiceCatalog: async () => {
        const response = await client.get('store/service-catalog/');
        return response.data.data;
    },

    // --- Settings & Configurations ---
    getSettings: async () => {
        const response = await client.get('store/settings/');
        return response.data.data;
    },
    updateSettings: async (id, data) => {
        const response = await client.put(`store/settings/${id}/`, data);
        return response.data.data;
    },
    getCustomization: async () => {
        const response = await client.get('store/customization/');
        return response.data.data;
    },
    getShippingSettings: async () => {
        const response = await client.get('store/shipping-settings/');
        return response.data.data;
    },
    getAddons: async () => {
        const response = await client.get('store/addons/');
        return response.data.data;
    },
    getTrackingConfigs: async () => {
        const response = await client.get('store/tracking-configs/');
        return response.data.data;
    },
    getLandingPages: async () => {
        const response = await client.get('store/landing-pages/');
        return response.data.data;
    }
};
