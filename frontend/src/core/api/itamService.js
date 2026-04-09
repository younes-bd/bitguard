import client from './client';

class ITAMService {
    async getAssets(params = {}) {
        const response = await client.get('itam/assets/', { params });
        return response.data.data;
    }

    async getAsset(id) {
        const response = await client.get(`itam/assets/${id}/`);
        return response.data.data;
    }

    async createAsset(data) {
        const response = await client.post('itam/assets/', data);
        return response.data.data;
    }

    async updateAsset(id, data) {
        const response = await client.put(`itam/assets/${id}/`, data);
        return response.data.data;
    }

    async deleteAsset(id) {
        const response = await client.delete(`itam/assets/${id}/`);
        return response.data.data;
    }

    async getLicenses(params = {}) {
        const response = await client.get('itam/assets/', { params: { ...params, asset_type: 'software' } });
        return response.data.data;
    }

    async getMaintenanceSchedules(params = {}) {
        const response = await client.get('itam/maintenance/', { params });
        return response.data.data;
    }
}

export default new ITAMService();
