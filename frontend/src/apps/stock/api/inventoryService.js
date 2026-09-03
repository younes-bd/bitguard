import client from '@/core/api/client';

class InventoryService {
    async getStats() {
        const response = await client.get('stock/dashboard/');
        return response.data?.data ?? response.data ?? {};
    }

    async getInventoryItems(params = {}) {
        const response = await client.get('stock/items/', { params });
        return response.data?.data ?? response.data;
    }

    async getInventoryItem(id) {
        const response = await client.get(`stock/items/${id}/`);
        return response.data?.data ?? response.data;
    }

    async createInventoryItem(data) {
        const response = await client.post('stock/items/', data);
        return response.data?.data ?? response.data;
    }

    async updateInventoryItem(id, data) {
        const response = await client.patch(`stock/items/${id}/`, data);
        return response.data?.data ?? response.data;
    }

    async adjustStock(id, data) {
        const response = await client.post(`stock/items/${id}/adjust_stock/`, data);
        return response.data;
    }

    async getGoodsReceipts(params = {}) {
        const response = await client.get('stock/goods-receipts/', { params });
        return response.data?.data ?? response.data;
    }

    async getGoodsReceipt(id) {
        const response = await client.get(`stock/goods-receipts/${id}/`);
        return response.data?.data ?? response.data;
    }

    async getLots(params = {}) {
        const response = await client.get('stock/lots/', { params });
        return response.data?.data ?? response.data;
    }

    async getLocations(params = {}) {
        const response = await client.get('stock/locations/', { params });
        return response.data?.data ?? response.data;
    }

    async getPickings(params = {}) {
        const response = await client.get('stock/pickings/', { params });
        return response.data?.data ?? response.data;
    }

    async getPicking(id) {
        const response = await client.get(`stock/pickings/${id}/`);
        return response.data?.data ?? response.data;
    }

    async getAdjustments(params = {}) {
        const response = await client.get('stock/adjustments/', { params });
        return response.data?.data ?? response.data;
    }

    async getAdjustment(id) {
        const response = await client.get(`stock/adjustments/${id}/`);
        return response.data?.data ?? response.data;
    }
}

export const inventoryService = new InventoryService();
export default inventoryService;
