import client from '@/core/api/client';

export const budgetService = {
    getBudgets: async (params = {}) => {
        const r = await client.get('accounting/budgets/', { params });
        return r.data?.data ?? r.data?.results ?? r.data;
    }
};
