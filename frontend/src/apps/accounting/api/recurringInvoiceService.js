import client from '@/core/api/client';

export const recurringInvoiceService = {
    getRecurringInvoices: async (params = {}) => {
        const r = await client.get('accounting/recurring-invoices/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createRecurringInvoice: async (data) => {
        const r = await client.post('accounting/recurring-invoices/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    toggleRecurring: async (id) => {
        const r = await client.post(`accounting/recurring-invoices/${id}/toggle/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    runRecurringNow: async (id) => {
        const r = await client.post(`accounting/recurring-invoices/${id}/run/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
