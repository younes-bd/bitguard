import client from './client';

export const billingService = {
    // Plans
    getPlans: async () => {
        const response = await client.get('billing/plans/');
        return response.data?.results || response.data;
    },
    getPlan: async (id) => {
        const response = await client.get(`billing/plans/${id}/`);
        return response.data;
    },
    createPlan: async (data) => {
        const response = await client.post('billing/plans/', data);
        return response.data;
    },
    updatePlan: async (id, data) => {
        const response = await client.patch(`billing/plans/${id}/`, data);
        return response.data;
    },
    deletePlan: async (id) => {
        const response = await client.delete(`billing/plans/${id}/`);
        return response.data;
    },

    // Subscriptions
    getSubscription: async () => {
        const response = await client.get('billing/subscriptions/current/');
        return response.data;
    },
    getSubscriptions: async (params = {}) => {
        const response = await client.get('billing/subscriptions/', { params });
        return response.data?.results || response.data;
    },
    subscribe: async (planId, interval) => {
        const response = await client.post('billing/subscriptions/', { plan_id: planId, interval });
        return response.data;
    },
    pauseSubscription: async (id) => {
        const response = await client.post(`billing/subscriptions/${id}/pause/`);
        return response.data;
    },
    resumeSubscription: async (id) => {
        const response = await client.post(`billing/subscriptions/${id}/resume/`);
        return response.data;
    },
    cancelSubscription: async (id) => {
        const response = await client.post(`billing/subscriptions/${id}/cancel/`);
        return response.data;
    },

    // Invoices / Payments
    getInvoices: async (params = {}) => {
        const response = await client.get('billing/invoices/', { params });
        return response.data?.results || response.data;
    }
};
