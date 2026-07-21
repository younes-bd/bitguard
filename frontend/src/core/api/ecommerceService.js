import client from './client';

export const ecommerceService = {
    // --- Products ---
    getProducts: async (params = {}) => {
        const response = await client.get('store/products/', { params });
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    getProduct: async (id) => {
        const response = await client.get(`store/products/${id}/`);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    getProductById: async (id) => {
        const response = await client.get(`store/products/${id}/`);
        return response.data?.data ?? response.data?.results ?? response.data;
    },

    // --- Categories ---
    getCategories: async () => {
        const response = await client.get('store/categories/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    createCategory: async (data) => {
        const response = await client.post('store/categories/', data);
        return response.data?.data ?? response.data?.results ?? response.data;
    },

    // --- Subscription Plans ---
    getPlans: async () => {
        const response = await client.get('store/subscription-plans/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },

    // --- Cart ---
    getCart: async (sessionId) => {
        const response = await client.get('store/carts/', { params: { session_id: sessionId } });
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    createCart: async (data) => {
        const response = await client.post('store/carts/', data);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    addToCart: async (cartId, itemData) => {
        const response = await client.post(`store/carts/${cartId}/items/`, itemData);
        return response.data;
    },
    removeFromCart: async (cartId, itemId) => {
        const response = await client.delete(`store/carts/${cartId}/items/${itemId}/`);
        return response.data;
    },

    // --- Orders & Checkout ---
    checkout: async (productId, checkoutData) => {
        const response = await client.post(`store/products/${productId}/checkout/`, checkoutData);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    subscribe: async (planId, subscribeData) => {
        const response = await client.post(`store/subscription-plans/${planId}/subscribe/`, subscribeData);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    createOrder: async (orderData) => {
        const response = await client.post('store/orders/', orderData);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    getOrders: async () => {
        const response = await client.get('store/orders/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    deleteOrder: async (id) => {
        const response = await client.delete(`store/orders/${id}/`);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    updateOrderStatus: async (id, status) => {
        const response = await client.post(`store/orders/${id}/update_status/`, { status });
        return response.data;
    },

    // --- User Subscriptions & Licenses ---
    getSubscriptions: async () => {
        const response = await client.get('store/subscriptions/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    startTrial: async (planId) => {
        const response = await client.post('store/subscriptions/start_trial/', { plan_id: planId });
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    createSubscription: async (data) => {
        const response = await client.post('store/subscriptions/', data);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    updateSubscription: async (id, data) => {
        const response = await client.put(`store/subscriptions/${id}/`, data);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    cancelSubscription: async (id) => {
        const response = await client.post(`store/subscriptions/${id}/cancel/`);
        return response.data?.data ?? response.data?.results ?? response.data;
    },

    getLicenses: async () => {
        const response = await client.get('store/licenses/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },

    // --- Customers ---
    getCustomers: async () => {
        const response = await client.get('store/customers/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },

    // --- Admin Management (Write Operations) ---
    createProduct: async (data) => {
        const response = await client.post('store/products/', data);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    updateProduct: async (id, data) => {
        const response = await client.put(`store/products/${id}/`, data);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    deleteProduct: async (id) => {
        const response = await client.delete(`store/products/${id}/`);
        return response.data?.data ?? response.data?.results ?? response.data;
    },

    // --- Service Catalog ---
    getServiceCatalog: async () => {
        const response = await client.get('store/service-catalog/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },

    // --- Settings & Configurations ---
    getSettings: async () => {
        const response = await client.get('store/settings/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    updateSettings: async (id, data) => {
        const response = await client.put(`store/settings/${id}/`, data);
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    getCustomization: async () => {
        const response = await client.get('store/customization/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    getShippingSettings: async () => {
        const response = await client.get('store/shipping-settings/');
        return response.data?.data ?? response.data;
    },
    createShippingSetting: async (data) => {
        const response = await client.post('store/shipping-settings/', data);
        return response.data?.data ?? response.data;
    },
    updateShippingSetting: async (id, data) => {
        const response = await client.patch(`store/shipping-settings/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    deleteShippingSetting: async (id) => {
        const response = await client.delete(`store/shipping-settings/${id}/`);
        return response.data?.data ?? response.data;
    },

    getAddons: async () => {
        const response = await client.get('store/addons/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    getTrackingConfigs: async () => {
        const response = await client.get('store/tracking-configs/');
        return response.data?.data ?? response.data?.results ?? response.data;
    },
    getLandingPages: async () => {
        const response = await client.get('store/landing-pages/');
        return response.data?.data ?? response.data?.results ?? response.data;
    }
};
