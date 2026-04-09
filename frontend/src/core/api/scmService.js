import client from './client';

class SCMService {
    async getStats() {
        const response = await client.get('scm/vendors/stats/');
        return response.data?.data ?? response.data ?? {};
    }

    async getVendors(params = {}) {
        const response = await client.get('scm/vendors/', { params });
        return response.data.data;
    }

    async getVendor(id) {
        const response = await client.get(`scm/vendors/${id}/`);
        return response.data.data;
    }

    async createVendor(data) {
        const response = await client.post('scm/vendors/', data);
        return response.data.data;
    }

    async updateVendor(id, data) {
        const response = await client.patch(`scm/vendors/${id}/`, data);
        return response.data.data;
    }

    async deleteVendor(id) {
        return client.delete(`scm/vendors/${id}/`);
    }

    async getInventoryItems(params = {}) {
        const response = await client.get('scm/inventory/', { params });
        return response.data.data;
    }

    async getInventoryItem(id) {
        const response = await client.get(`scm/inventory/${id}/`);
        return response.data.data;
    }

    async createInventoryItem(data) {
        const response = await client.post('scm/inventory/', data);
        return response.data.data;
    }

    async updateInventoryItem(id, data) {
        const response = await client.patch(`scm/inventory/${id}/`, data);
        return response.data.data;
    }

    async adjustStock(id, quantity) {
        const response = await client.post(`scm/inventory/${id}/adjust/`, { quantity });
        return response.data.data;
    }

    async getPurchaseOrders(params = {}) {
        const response = await client.get('scm/purchase-orders/', { params });
        return response.data.data;
    }

    async getPurchaseOrder(id) {
        const response = await client.get(`scm/purchase-orders/${id}/`);
        return response.data.data;
    }

    async createPurchaseOrder(data) {
        const response = await client.post('scm/purchase-orders/', data);
        return response.data.data;
    }

    async receivePurchaseOrder(id) {
        const response = await client.post(`scm/purchase-orders/${id}/receive/`);
        return response.data.data;
    }

    async updatePurchaseOrder(id, data) {
        const response = await client.patch(`scm/purchase-orders/${id}/`, data);
        return response.data.data;
    }
}

export const scmService = new SCMService();
export default scmService;
