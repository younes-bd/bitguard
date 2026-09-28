import client from '@/core/api/client';

export const taxService = {
    getTaxGroups: async (params = {}) => {
        const r = await client.get('accounting/tax-groups/', { params });
        return r.data?.data ?? r.data;
    },
    createTaxGroup: async (data) => {
        const r = await client.post('accounting/tax-groups/', data);
        return r.data?.data ?? r.data;
    },
    updateTaxGroup: async (id, data) => {
        const r = await client.patch(`accounting/tax-groups/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    getTaxAuthorities: async (params = {}) => {
        const r = await client.get('accounting/tax-authorities/', { params });
        return r.data?.data ?? r.data;
    }
};
