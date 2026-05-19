import client from '../../../core/api/client';

const itamService = {
    getAssets: async (params = {}) => {
        const response = await client.get('itam/assets/', { params });
        return response.data?.data ?? response.data;
    },
    getAsset: async (id) => {
        const response = await client.get(`itam/assets/${id}/`);
        return response.data?.data ?? response.data;
    },
    createAsset: async (data) => {
        const response = await client.post('itam/assets/', data);
        return response.data?.data ?? response.data;
    },
    updateAsset: async (id, data) => {
        const response = await client.patch(`itam/assets/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    deleteAsset: async (id) => {
        const response = await client.delete(`itam/assets/${id}/`);
        return response.data?.data ?? response.data;
    },
    getStats: async () => {
        const response = await client.get('itam/dashboard/');
        return response.data?.data ?? response.data;
    },
    getAssignments: async () => {
        const response = await client.get('itam/assignments/');
        return response.data?.data ?? response.data;
    },
    getMaintenance: async (assetId) => {
        const response = await client.get('itam/maintenance/', { params: { asset: assetId } });
        return response.data?.data ?? response.data;
    },
    createMaintenance: async (data) => {
        const response = await client.post('itam/maintenance/', data);
        return response.data?.data ?? response.data;
    },
};

export default itamService;
