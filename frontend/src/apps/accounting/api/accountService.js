import client from '@/core/api/client';

export const accountService = {
    getAccounts: async (params = {}) => {
        const r = await client.get('accounting/accounts/', { params });
        return r.data?.data ?? r.data;
    }
};
