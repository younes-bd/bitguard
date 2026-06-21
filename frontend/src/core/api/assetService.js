import client from './client';

class AssetService {
    async getAssets(params = {}) {
        const response = await client.get('assets/assets/', { params });
        return response.data.data;
    }

    async getAsset(id) {
        const response = await client.get(`assets/assets/${id}/`);
        return response.data.data;
    }

    async createAsset(data) {
        const response = await client.post('assets/assets/', data);
        return response.data.data;
    }

    async updateAsset(id, data) {
        const response = await client.put(`assets/assets/${id}/`, data);
        return response.data.data;
    }

    async deleteAsset(id) {
        const response = await client.delete(`assets/assets/${id}/`);
        return response.data.data;
    }

    async getLicenses(params = {}) {
        const response = await client.get('assets/assets/', { params: { ...params, asset_type: 'software' } });
        return response.data.data;
    }

    async getMaintenanceSchedules(params = {}) {
        const response = await client.get('assets/maintenance/', { params });
        return response.data.data;
    }
}

export default new AssetService();
