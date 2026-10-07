import client from '@/core/api/client';

export const expenseService = {
    getExpenses: async (params = {}) => {
        const r = await client.get('accounting/expenses/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    createExpense: async (data) => {
        const r = await client.post('accounting/expenses/', data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    updateExpense: async (id, data) => {
        const r = await client.patch(`accounting/expenses/${id}/`, data);
        return r.data?.data ?? r.data?.results ?? r.data;
    },
    deleteExpense: async (id) => {
        const r = await client.delete(`accounting/expenses/${id}/`);
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
