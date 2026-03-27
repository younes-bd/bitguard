import client from './client';

const base = '/billing';

export const billingService = {
    // Plans
    getPlans: () => client.get(`${base}/plans/`).then(r => r.data?.results ?? r.data ?? []),

    // Subscribe → returns { checkout_url } for Stripe redirect
    subscribe: (planId, interval = 'monthly') =>
        client.post(`${base}/plans/${planId}/subscribe/`, { interval }).then(r => r.data),

    // Active subscription for the current user/tenant
    getSubscription: () => client.get(`${base}/subscriptions/`).then(r => r.data?.results?.[0] ?? null),
    cancelSubscription: (id) => client.post(`${base}/subscriptions/${id}/cancel/`).then(r => r.data),

    // Billing history / orders
    getOrders: (params = {}) => client.get(`${base}/orders/`, { params }).then(r => r.data),

    // Settings
    getSettings: () => client.get(`${base}/settings/`).then(r => r.data?.results?.[0] ?? r.data ?? {}),
    updateSettings: (id, data) => client.patch(`${base}/settings/${id}/`, data).then(r => r.data),
};

export default billingService;
