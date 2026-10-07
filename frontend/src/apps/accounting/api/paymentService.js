import client from '@/core/api/client';

export const paymentService = {
    getPayments: async (params = {}) => {
        const r = await client.get('accounting/payments/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createPayment: async (data) => {
        const r = await client.post('accounting/payments/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    voidPayment: async (id) => {
        const r = await client.post(`accounting/payments/${id}/void/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
