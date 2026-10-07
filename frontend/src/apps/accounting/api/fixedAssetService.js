import client from '@/core/api/client';

export const fixedAssetService = {
    getFixedAssets: async (params = {}) => {
        const r = await client.get('accounting/fixed-assets/', { params });
        return r.data?.data ?? r.data;
    },
    createFixedAsset: async (data) => {
        const r = await client.post('accounting/fixed-assets/', data);
        return r.data?.data ?? r.data;
    },
    updateFixedAsset: async (id, data) => {
        const r = await client.patch(`accounting/fixed-assets/${id}/`, data);
        return r.data?.data ?? r.data;
    },
    deleteFixedAsset: async (id) => {
        const r = await client.delete(`accounting/fixed-assets/${id}/`);
        return r.data?.data ?? r.data;
    },
    runDepreciation: async () => {
        const r = await client.post('accounting/fixed-assets/run-depreciation/');
        return r.data?.data ?? r.data;
    }
};
