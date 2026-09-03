import client from '@/core/api/client';

const maintenanceService = {
    getAssets: async (params = {}) => {
        const response = await client.get('maintenance/maintenance/', { params });
        return response.data?.data ?? response.data;
    },
    getAsset: async (id) => {
        const response = await client.get(`maintenance/maintenance/${id}/`);
        return response.data?.data ?? response.data;
    },
    createAsset: async (data) => {
        const response = await client.post('maintenance/maintenance/', data);
        return response.data?.data ?? response.data;
    },
    updateAsset: async (id, data) => {
        const response = await client.patch(`maintenance/maintenance/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    deleteAsset: async (id) => {
        const response = await client.delete(`maintenance/maintenance/${id}/`);
        return response.data?.data ?? response.data;
    },
    getStats: async () => {
        const response = await client.get('maintenance/dashboard/');
        return response.data?.data ?? response.data;
    },
    getAssignments: async () => {
        const response = await client.get('maintenance/assignments/');
        return response.data?.data ?? response.data;
    },
    getMaintenance: async (assetId) => {
        const response = await client.get('maintenance/maintenance/', { params: { asset: assetId } });
        return response.data?.data ?? response.data;
    },
    createMaintenance: async (data) => {
        const response = await client.post('maintenance/maintenance/', data);
        return response.data?.data ?? response.data;
    },
};

export default maintenanceService;
