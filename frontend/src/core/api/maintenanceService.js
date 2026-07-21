import client from './client';

class MaintenanceService {
    async getAssets(params = {}) {
        const response = await client.get('assets/maintenance/', { params });
        return response.data.data;
    }

    async getAsset(id) {
        const response = await client.get(`assets/maintenance/${id}/`);
        return response.data.data;
    }

    async createAsset(data) {
        const response = await client.post('assets/maintenance/', data);
        return response.data.data;
    }

    async updateAsset(id, data) {
        const response = await client.put(`assets/maintenance/${id}/`, data);
        return response.data.data;
    }

    async deleteAsset(id) {
        const response = await client.delete(`assets/maintenance/${id}/`);
        return response.data.data;
    }

    async getLicenses(params = {}) {
        const response = await client.get('assets/maintenance/', { params: { ...params, asset_type: 'software' } });
        return response.data.data;
    }

    async getMaintenanceSchedules(params = {}) {
        const response = await client.get('assets/maintenance/', { params });
        return response.data.data;
    }
}

export default new MaintenanceService();
