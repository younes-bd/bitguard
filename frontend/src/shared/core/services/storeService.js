import client from './client';

export const storeService = {
    // --- Products ---
    getProducts: async (params = {}) => {
        const response = await client.get('store/products/', { params });
        return response.data;
    },
    getProduct: async (id) => {
        const response = await client.get(`store/products/${id}/`);
        return response.data;
    },

    // --- Subscription Plans ---
    getPlans: async () => {
        const response = await client.get('store/plans/');
        return response.data;
    },

    // --- Orders & Checkout ---
    getOrders: async () => {
        const response = await client.get('store/orders/');
        return response.data;
    },
    createOrder: async (orderData) => {
        const response = await client.post('store/orders/', orderData);
        return response.data;
    },
    deleteOrder: async (id) => {
        const response = await client.delete(`store/orders/${id}/`);
        return response.data;
    },

    // --- User Subscriptions & Licenses ---
    getSubscriptions: async () => {
        const response = await client.get('store/subscriptions/');
        return response.data;
    },
    startTrial: async (planId) => {
        const response = await client.post('store/subscriptions/start_trial/', { plan_id: planId });
        return response.data;
    },
    createSubscription: async (data) => {
        const response = await client.post('store/subscriptions/', data);
        return response.data;
    },
    updateSubscription: async (id, data) => {
        const response = await client.put(`store/subscriptions/${id}/`, data);
        return response.data;
    },
    cancelSubscription: async (id) => {
        const response = await client.post(`store/subscriptions/${id}/cancel/`);
        return response.data;
    },

    getLicenses: async () => {
        const response = await client.get('store/licenses/');
        return response.data;
    },

    // --- Admin Management (Write Operations) ---
    createProduct: async (data) => {
        const response = await client.post('store/products/', data);
        return response.data;
    },
    updateProduct: async (id, data) => {
        const response = await client.put(`store/products/${id}/`, data);
        return response.data;
    },
    deleteProduct: async (id) => {
        const response = await client.delete(`store/products/${id}/`);
        return response.data;
    },

    // --- Settings ---
    getSettings: async () => {
        const response = await client.get('store/settings/');
        return response.data;
    },
    updateSettings: async (settings) => {
        const response = await client.post('store/settings/', settings); // Using POST or PUT depending on backend convention
        return response.data;
    }
};
