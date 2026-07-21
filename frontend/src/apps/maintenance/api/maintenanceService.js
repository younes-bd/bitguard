import client from '../../../core/api/client';

const maintenanceService = {
    getAssets: async (params = {}) => {
        const response = await client.get('assets/maintenance/', { params });
        return response.data?.data ?? response.data;
    },
    getAsset: async (id) => {
        const response = await client.get(`assets/maintenance/${id}/`);
        return response.data?.data ?? response.data;
    },
    createAsset: async (data) => {
        const response = await client.post('assets/maintenance/', data);
        return response.data?.data ?? response.data;
    },
    updateAsset: async (id, data) => {
        const response = await client.patch(`assets/maintenance/${id}/`, data);
        return response.data?.data ?? response.data;
    },
    deleteAsset: async (id) => {
        const response = await client.delete(`assets/maintenance/${id}/`);
        return response.data?.data ?? response.data;
    },
    getStats: async () => {
        const response = await client.get('assets/dashboard/');
        return response.data?.data ?? response.data;
    },
    getAssignments: async () => {
        const response = await client.get('assets/assignments/');
        return response.data?.data ?? response.data;
    },
    getMaintenance: async (assetId) => {
        const response = await client.get('assets/maintenance/', { params: { asset: assetId } });
        return response.data?.data ?? response.data;
    },
    createMaintenance: async (data) => {
        const response = await client.post('assets/maintenance/', data);
        return response.data?.data ?? response.data;
    },
};

export default maintenanceService;
